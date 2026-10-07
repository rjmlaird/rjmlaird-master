// Builds one cross-linked schema.org @graph per page.
//
// Every entity has a stable @id, and nodes reference each other by @id instead of repeating themselves:
//   WebSite  ──publisher──▶ Person ◀──mainEntity── ProfilePage
//   WebPage  ──isPartOf───▶ WebSite     ──breadcrumb──▶ BreadcrumbList
//   Person   ──worksFor/founder──▶ Organization nodes
// Core nodes (Person, WebSite, WebPage, BreadcrumbList) are on every page; the full Person profile
// (employers, education, credentials, memberships, awards, languages, expertise) is on the pages that
// are about Ryan, so other pages stay light.
import type { SchemaSource } from "./source";
import { clean, dedupe, norm, slugify, toIsoDate } from "./util";

export type PageType = "WebPage" | "ProfilePage" | "AboutPage" | "ContactPage" | "CollectionPage" | "FAQPage" | "ItemPage";
type Node = Record<string, any>;

export interface Crumb { name: string; path?: string }

export interface PageInput {
  siteUrl: string;            // origin, no trailing slash
  path: string;               // pathname, e.g. /about/
  canonicalUrl: string;
  title: string;
  description: string;
  imageUrl: string;
  type?: PageType;
  full?: boolean;             // include the full Person profile + organisation nodes
  breadcrumbs?: Crumb[];      // explicit trail; otherwise derived from the path
  datePublished?: string | Date;
  dateModified?: string | Date;
  mainEntity?: Node;          // page's primary entity (BlogPosting, PodcastEpisode, VideoObject ...)
  extras?: Node[];            // any further nodes (ItemList, Service ...)
  knownSections: string[];    // first-level paths that exist (used for breadcrumb parents)
}

const SECTION_LABELS: Record<string, string> = {
  "work-with-me": "Work with me", "open-source": "Open source", cv: "CV", faq: "FAQ", dev: "Dev",
  "case-studies": "Case studies", press: "Press & media", blog: "Blog", podcasts: "Podcasts", videos: "Videos",
};
const label = (seg: string) => SECTION_LABELS[seg] ?? seg.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());

export function buildBreadcrumbs(input: Pick<PageInput, "path" | "title" | "knownSections">): Crumb[] {
  const segs = input.path.split("/").filter(Boolean);
  if (!segs.length) return [];
  const trail: Crumb[] = [{ name: "Home", path: "/" }];
  // Only link a parent level when we know it exists; skipping beats pointing at a 404.
  if (segs.length > 1 && input.knownSections.includes(segs[0])) trail.push({ name: label(segs[0]), path: `/${segs[0]}/` });
  trail.push({ name: input.title.replace(/\s*[·|—-]\s*Ryan Laird.*$/, "").trim() || label(segs[segs.length - 1]) });
  return trail;
}

export function ids(siteUrl: string) {
  return {
    person: `${siteUrl}/#person`,
    website: `${siteUrl}/#website`,
    portrait: `${siteUrl}/#portrait`,
    org: (key: string) => `${siteUrl}/#org-${key}`,
  };
}

function buildOrganisations(src: SchemaSource, siteUrl: string): Node[] {
  const id = ids(siteUrl);
  return src.organisations.map((o: any) =>
    clean({
      "@type": "Organization",
      "@id": id.org(o.key),
      name: o.name,
      alternateName: o.alternateName,
      url: o.url,
      description: o.description,
      foundingDate: o.foundingDate,
      founder: o.foundedBySubject ? { "@id": id.person } : undefined,
    }),
  );
}

function buildPerson(src: SchemaSource, input: PageInput): Node {
  const { siteUrl } = input;
  const id = ids(siteUrl);
  const p = src.person;
  const [givenName, ...rest] = p.name.split(" ");
  const base: Node = {
    "@type": "Person",
    "@id": id.person,
    name: p.name,
    givenName,
    familyName: rest.join(" ") || undefined,
    alternateName: p.preferredName && p.preferredName !== p.name ? p.preferredName : undefined,
    url: `${siteUrl}/`,
    image: { "@id": id.portrait },
    jobTitle: p.role,
    description: p.headline,
    sameAs: src.sameAs,
  };
  if (!input.full) return clean(base);

  /* ---- employers: current roles → worksFor, past roles → alumniOf (an accurate use of the property) ---- */
  const seedByName = new Map(src.organisations.map((o: any) => [norm(o.name), o]));
  const orgName = (o: any) => (typeof o === "string" ? o : o?.name);
  const orgUrl = (o: any) => (typeof o === "object" ? o?.website : undefined);
  const worksFor: Node[] = src.organisations.filter((o: any) => o.worksFor).map((o: any) => ({ "@id": id.org(o.key) }));
  const pastEmployers: Node[] = [];
  const seen = new Set<string>(src.organisations.map((o: any) => norm(o.name)));
  for (const r of src.experience) {
    const n = orgName(r.organisation);
    if (!n) continue;
    const seed = seedByName.get(norm(n));
    if (r.current && seed) continue; // already covered by the seed organisation node
    if (r.current) worksFor.push(clean({ "@type": "Organization", name: n, url: orgUrl(r.organisation) }));
    else if (!seen.has(norm(n))) {
      seen.add(norm(n));
      pastEmployers.push(clean({ "@type": "Organization", name: n, url: orgUrl(r.organisation) }));
    }
  }

  /* ---- education: seed merged with API (API wins on field) ---- */
  const edu = new Map<string, Node>();
  for (const a of src.alumniOf) edu.set(norm(a.name), { "@type": "CollegeOrUniversity", name: a.name, url: (a as any).url });
  for (const e of src.education) {
    const k = norm(e.institution);
    edu.set(k, clean({ ...(edu.get(k) ?? { "@type": "CollegeOrUniversity", name: e.institution }), department: e.field ?? undefined }));
  }

  /* ---- credentials: seed + API certifications, deduped by name ---- */
  const credMap = new Map<string, Node>();
  const addCred = (name: string, category?: string, issuer?: string, created?: string | null, url?: string) =>
    credMap.set(norm(name), clean({
      "@type": "EducationalOccupationalCredential",
      name,
      credentialCategory: category,
      recognizedBy: issuer ? { "@type": "Organization", name: issuer } : undefined,
      dateCreated: toIsoDate(created ?? undefined),
      url,
    }));
  for (const c of src.credentials) addCred(c.name, c.category, c.issuer);
  for (const c of src.certifications) addCred(c.name, c.level ?? "Certification", c.issuer, c.issueDate, c.badgeUrl);

  /* ---- memberships: API groups + the bodies behind seed membership credentials ---- */
  const members = dedupe([
    ...src.memberships.flatMap((g) => g.items.map((i) => i.organisation)),
    ...src.credentials.filter((c) => /member|fellow|chartered/i.test(`${c.category} ${c.name}`)).map((c) => c.issuer),
  ]).map((n) => ({ "@type": "Organization", name: n }));

  const awards = dedupe(
    src.awards.map((a) =>
      [a.title, Array.isArray(a.issuer) ? a.issuer.join(", ") : a.issuer, a.year].filter(Boolean).join(" — "),
    ),
  );

  const languages = dedupe([...src.apiLanguages.map((l) => l.name), ...src.languages]).map((n) => ({ "@type": "Language", name: n }));

  return clean({
    ...base,
    honorificSuffix: p.credentialsText?.split("·").map((s) => s.trim()).filter(Boolean).join(", "),
    email: p.email ? `mailto:${p.email}` : undefined,
    address: { "@type": "PostalAddress", addressLocality: p.location.split(",")[0].trim(), addressCountry: "GB" },
    identifier: p.orcid ? { "@type": "PropertyValue", propertyID: "ORCID", value: p.orcid, url: `https://orcid.org/${p.orcid}` } : undefined,
    hasOccupation: { "@type": "Occupation", name: p.role, skills: src.knowsAbout.slice(0, 8).join(", ") },
    worksFor,
    affiliation: src.organisations.filter((o: any) => !o.worksFor).map((o: any) => ({ "@id": id.org(o.key) })),
    alumniOf: [...edu.values(), ...pastEmployers],
    memberOf: members,
    hasCredential: [...credMap.values()],
    award: awards,
    knowsLanguage: languages,
    knowsAbout: src.knowsAbout.slice(0, 40),
  });
}

export function buildPageGraph(src: SchemaSource, input: PageInput) {
  const { siteUrl, canonicalUrl } = input;
  const id = ids(siteUrl);
  const type = input.type ?? "WebPage";
  const pageId = `${canonicalUrl}#webpage`;
  const crumbId = `${canonicalUrl}#breadcrumb`;
  const mainId = `${canonicalUrl}#main`;
  const isHome = input.path === "/";
  const isProfile = type === "ProfilePage" || type === "AboutPage";

  const trail = input.breadcrumbs ?? buildBreadcrumbs(input);
  const breadcrumb = trail.length
    ? {
        "@type": "BreadcrumbList",
        "@id": crumbId,
        itemListElement: trail.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          // schema.org: the final crumb is the current page; it may omit item
          item: c.path ? new URL(c.path, siteUrl).href : undefined,
        })),
      }
    : undefined;

  const website = {
    "@type": "WebSite",
    "@id": id.website,
    url: `${siteUrl}/`,
    name: src.site.name,
    alternateName: src.site.alternateName,
    description: src.person.headline,
    inLanguage: "en-GB",
    publisher: { "@id": id.person },
    copyrightHolder: { "@id": id.person },
  };

  const portrait = {
    "@type": "ImageObject",
    "@id": id.portrait,
    url: new URL(src.person.avatar ?? "/images/og-default.jpg", siteUrl).href,
    contentUrl: new URL(src.person.avatar ?? "/images/og-default.jpg", siteUrl).href,
    caption: `Portrait of ${src.person.name}`,
    creditText: src.person.name,
  };

  const mainEntity = input.mainEntity
    ? { ...input.mainEntity, "@id": mainId, mainEntityOfPage: { "@id": pageId }, isPartOf: undefined }
    : undefined;

  const webpage = {
    "@type": type,
    "@id": pageId,
    url: canonicalUrl,
    name: input.title,
    description: input.description,
    inLanguage: "en-GB",
    isPartOf: { "@id": id.website },
    breadcrumb: breadcrumb ? { "@id": crumbId } : undefined,
    primaryImageOfPage: { "@type": "ImageObject", url: input.imageUrl },
    datePublished: toIsoDate(input.datePublished),
    dateModified: toIsoDate(input.dateModified ?? input.datePublished),
    about: isHome || isProfile ? { "@id": id.person } : undefined,
    mainEntity: mainEntity ? { "@id": mainId } : isProfile ? { "@id": id.person } : undefined,
    potentialAction: type === "ContactPage" ? undefined : { "@type": "ReadAction", target: [canonicalUrl] },
  };

  const graph: Node[] = [
    website,
    webpage,
    buildPerson(src, input),
    portrait,
    ...(input.full ? buildOrganisations(src, siteUrl) : []),
    breadcrumb,
    mainEntity,
    ...(input.extras ?? []),
  ].filter(Boolean) as Node[];

  // Same @id twice would be a graph error; keep the first (the richest) occurrence.
  const seen = new Set<string>();
  const unique = graph.filter((n) => {
    const key = n["@id"];
    if (!key) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { "@context": "https://schema.org", "@graph": unique.map((n) => clean(n)) };
}

export { slugify };
