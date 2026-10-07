// Loads everything the schema.org graph needs: local seed data first, then live API data merged on top.
// Memoised per build, with per-request timeouts and per-item validation so a slow or malformed API response
// can never break a build or blank the graph.
import { z } from "zod";
import seed from "../../data/schema-org.json";
import profileLocal from "../../data/profile.json";
import socialsLocal from "../../data/socials.json";
import cvLocal from "../../data/cv.json";
import expertiseLocal from "../../data/expertise.json";
import { dedupe, normaliseUrl } from "./util";

const API_BASE = "https://api.rjmlaird.co.uk/api";
const TIMEOUT_MS = 6000;

/* ---------- tolerant item schemas (only the fields the graph uses) ---------- */
const orgRef = z.union([z.string(), z.object({ name: z.string().optional(), website: z.string().optional() }).loose()]);

const experienceItem = z.object({
  role: z.string(),
  organisation: orgRef.optional(),
  startDate: z.string().optional(),
  endDate: z.string().nullable().optional(),
  current: z.boolean().optional(),
  summary: z.string().optional(),
  skills: z.array(z.string()).optional(),
}).loose();

const educationItem = z.object({
  institution: z.string(),
  field: z.string().optional(),
  qualification: z.string().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  skills: z.array(z.string()).optional(),
}).loose();

const certificationItem = z.object({
  name: z.string(),
  issuer: z.string().optional(),
  issueDate: z.string().nullable().optional(),
  expiryDate: z.string().nullable().optional(),
  level: z.string().nullable().optional(),
  badgeUrl: z.string().optional(),
}).loose();

const membershipGroup = z.object({
  title: z.string().optional(),
  items: z.array(z.object({ organisation: z.string(), role: z.string().optional() }).loose()),
}).loose();

const awardItem = z.object({
  title: z.string(),
  issuer: z.union([z.string(), z.array(z.string())]).optional(),
  year: z.number().optional(),
  url: z.string().optional(),
}).loose();

const languageItem = z.object({ name: z.string(), level: z.string().optional() }).loose();

const profileApi = z.object({
  name: z.string().optional(),
  headline: z.string().optional(),
  role: z.string().optional(),
  location: z.string().optional(),
  tags: z.array(z.string()).optional(),
}).loose();

export type ExperienceItem = z.infer<typeof experienceItem>;
export type EducationItem = z.infer<typeof educationItem>;
export type CertificationItem = z.infer<typeof certificationItem>;
export type MembershipGroup = z.infer<typeof membershipGroup>;
export type AwardItem = z.infer<typeof awardItem>;
export type LanguageItem = z.infer<typeof languageItem>;

async function getJson(path: string): Promise<unknown | null> {
  try {
    const res = await fetch(`${API_BASE}/${path}`, { headers: { accept: "application/json" }, signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) throw new Error(String(res.status));
    return await res.json();
  } catch {
    return null; // seed data covers for it; build logs one summary line below
  }
}

/** Validates each item on its own so one bad record does not discard the rest. */
function items<T>(raw: unknown, schema: z.ZodType<T>, wrapperKey?: string): T[] {
  const root = raw && typeof raw === "object" && wrapperKey && wrapperKey in (raw as object) ? (raw as any)[wrapperKey] : raw;
  if (!Array.isArray(root)) return [];
  return root.flatMap((r) => {
    const p = schema.safeParse(r);
    return p.success ? [p.data] : [];
  });
}

export interface SchemaSource {
  site: { name: string; alternateName?: string };
  person: {
    name: string;
    preferredName?: string;
    headline: string;
    role: string;
    location: string;
    email?: string;
    avatar?: string;
    credentialsText?: string;
    orcid?: string;
    tags: string[];
  };
  organisations: typeof seed.organisations;
  alumniOf: typeof seed.alumniOf;
  credentials: typeof seed.credentials;
  sameAs: string[];
  knowsAbout: string[];
  languages: string[];
  portfolioLinks: { label: string; href: string }[];
  experience: ExperienceItem[];
  education: EducationItem[];
  certifications: CertificationItem[];
  memberships: MembershipGroup[];
  awards: AwardItem[];
  apiLanguages: LanguageItem[];
  apiProfile: z.infer<typeof profileApi> | null;
  live: boolean;
}

let cached: Promise<SchemaSource> | null = null;

export function loadSchemaSource(): Promise<SchemaSource> {
  cached ??= (async () => {
    const [exp, edu, cert, mem, awd, lang, prof, soc] = await Promise.all([
      getJson("experience"), getJson("education"), getJson("certifications"), getJson("memberships"),
      getJson("awards"), getJson("languages"), getJson("profile"), getJson("socials"),
    ]);
    const live = [exp, edu, cert, mem, awd, lang, prof, soc].some((x) => x !== null);
    if (!live) console.warn("[schema-org] API unreachable; using local seed data only.");

    const apiProfile = prof ? (profileApi.safeParse(prof).success ? (prof as z.infer<typeof profileApi>) : null) : null;
    const apiSocials = items(soc, z.object({ url: z.string() }).loose()).map((s) => normaliseUrl(s.url));

    const sameAs = dedupe([
      ...seed.sameAs.map(normaliseUrl),
      // socials.json holds many unfilled template entries (e.g. stackoverflow.com/users/1234567), so only entries
      // explicitly marked "verified": true are trusted for identity claims. API socials are trusted as live data.
      ...socialsLocal.filter((s: any) => s.verified === true).map((s: any) => normaliseUrl(s.url)),
      ...apiSocials,
      normaliseUrl("https://gitlab.com/rjmlaird"),
      ...profileLocal.contact.map((c: any) => normaliseUrl(c.href)).filter((h) => h && /orcid\.org/.test(h)),
    ]).filter((u) => u.startsWith("http"));

    const expertise = ((expertiseLocal as any).expertise ?? []).map((e: any) => (typeof e === "string" ? e : e?.title ?? e?.name)).filter(Boolean) as string[];
    const knowsAbout = dedupe([...(apiProfile?.tags ?? []), ...profileLocal.tags, ...expertise, ...seed.fallbackKnowsAbout]);

    const localCredentialNames = new Set(seed.credentials.map((c) => c.name));
    const extraCredentials = ((cvLocal as any).credentials ?? [])
      .filter((c: string) => ![...localCredentialNames].some((n) => n.split("(")[0].trim().toLowerCase() === c.split("(")[0].trim().toLowerCase()))
      .map((name: string) => ({ name, category: "Credential", issuer: "" }));

    return {
      site: { name: seed.siteName, alternateName: seed.siteAlternateName },
      person: {
        name: apiProfile?.name ?? profileLocal.name,
        preferredName: profileLocal.preferredName,
        headline: apiProfile?.headline ?? profileLocal.headline,
        role: apiProfile?.role ?? profileLocal.role,
        location: apiProfile?.location ?? profileLocal.location,
        email: profileLocal.email,
        avatar: profileLocal.avatar,
        credentialsText: profileLocal.credentials,
        orcid: seed.orcid,
        tags: profileLocal.tags,
      },
      organisations: seed.organisations,
      alumniOf: seed.alumniOf,
      credentials: [...seed.credentials, ...extraCredentials],
      sameAs,
      knowsAbout,
      languages: seed.languages,
      portfolioLinks: profileLocal.portfolioLinks,
      experience: items(exp, experienceItem),
      education: items(edu, educationItem),
      certifications: items(cert, certificationItem, "certifications"),
      memberships: items(mem, membershipGroup, "memberships"),
      awards: items(awd, awardItem, "awards"),
      apiLanguages: items(lang, languageItem),
      apiProfile,
      live,
    } satisfies SchemaSource;
  })();
  return cached;
}
