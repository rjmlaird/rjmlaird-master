import { z } from "zod";
import { educationSchema } from "@/lib/schemas/education.schema";
import { experienceItemSchema } from "@/lib/schemas/experience.schema";
import { organisationSchema } from "@/lib/schemas/organisation.schema";
import { volunteeringSchema } from "@/lib/schemas/volunteering.schema";
import { awardSchema } from "@/lib/schemas/award.schema";
import { profileSchema } from "@/lib/schemas/profile.schema";
import { socialSchema } from "@/lib/schemas/social.schema";
import { techStackSchema } from "@/lib/schemas/tool.schema";
import { videoSchema } from "@/lib/schemas/video.schema";

export type Profile = z.infer<typeof profileSchema>;

const API_BASE = "https://api.rjmlaird.co.uk/api";
const MANIFEST_URL = "https://pub-2bd99ffbe3b44222ae5b1b9c3482209f.r2.dev/manifest.json";

async function fetchJson<T>(url: string, isFullUrl = false): Promise<T | null> {
  try {
    const fullUrl = isFullUrl ? url : `${API_BASE}/${url}`;
    const res = await fetch(fullUrl, { headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`${res.status}`);
    return (await res.json()) as T;
  } catch (e) {
    console.error(`[API] Failed to fetch ${url}:`, e);
    return null;
  }
}

function normalizeExperience(input: unknown): unknown {
  if (!Array.isArray(input)) return input;

  return input.map((item) => {
    if (!item || typeof item !== "object") return item;
    const obj = item as Record<string, unknown>;
    const org = obj.organisation;

    const normalizedOrg =
      typeof org === "string"
        ? { id: org, name: org, slug: org }
        : org && typeof org === "object"
          ? {
              id: typeof (org as any).id === "string" ? (org as any).id : "",
              name: typeof (org as any).name === "string" ? (org as any).name : "",
              slug: typeof (org as any).slug === "string" ? (org as any).slug : "",
              type: typeof (org as any).type === "string" ? (org as any).type : undefined,
              website: typeof (org as any).website === "string" ? (org as any).website : undefined,
            }
          : undefined;

    return {
      ...obj,
      organisation: normalizedOrg,
      endDate: obj.endDate ?? null,
    };
  });
}

function normalizeVideos(input: unknown): unknown {
  if (!Array.isArray(input)) return input;

  return input.map((item) => {
    if (!item || typeof item !== "object") return item;
    const obj = item as Record<string, unknown>;
    const rawId = typeof obj.youtubeId === "string" ? obj.youtubeId : "";
    const cleanId = rawId.replace(/^v=/, "").split("&")[0].split("?")[0];

    const title = typeof obj.title === "string" ? obj.title : "";
    const generatedSlug = title.trim()
      ? title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      : cleanId || "video";

    return {
      ...obj,
      youtubeId: cleanId,
      slug: generatedSlug,
    };
  });
}

export async function getDocuments() {
  const data = await fetchJson<unknown>(MANIFEST_URL, true);
  return Array.isArray(data) ? data : [];
}

export async function getAwards() {
  const data = await fetchJson<any>("awards");
  const rawAwards = data && typeof data === "object" && "awards" in data ? data.awards : data;
  const result = z.array(awardSchema).safeParse(rawAwards);
  if (!result.success) console.error("[API] Awards validation failed:", result.error.issues);
  return result.success ? result.data : [];
}

export async function getExperience() {
  const data = normalizeExperience(await fetchJson<unknown>("experience"));
  const result = z.array(experienceItemSchema).safeParse(data);
  if (!result.success) console.error("[API] Experience validation failed:", result.error.issues);
  return result.success ? result.data : [];
}

export async function getEducation() {
  const data = await fetchJson<unknown>("education");
  const result = z.array(educationSchema).safeParse(data);
  if (!result.success) console.error("[API] Education validation failed:", result.error.issues);
  return result.success ? result.data : [];
}

export async function getVolunteering() {
  const data = await fetchJson<unknown>("volunteering");
  const result = z.array(volunteeringSchema).safeParse(data);
  if (!result.success) console.error("[API] Volunteering validation failed:", result.error.issues);
  return result.success ? result.data : [];
}

export async function getOrganisations() {
  const data = await fetchJson<unknown>("organisations");
  const result = z.array(organisationSchema).safeParse(data);
  if (!result.success) console.error("[API] Organisations validation failed:", result.error.issues);
  return result.success ? result.data : [];
}

export async function getSocials() {
  const data = await fetchJson<unknown>("socials");
  const result = z.array(socialSchema).safeParse(data);
  if (!result.success) console.error("[API] Socials validation failed:", result.error.issues);
  return result.success ? result.data : [];
}

export async function getProfile(): Promise<Profile | null> {
  const data = await fetchJson<unknown>("profile");
  if (!data) return null;
  const result = profileSchema.safeParse(data);
  if (!result.success) console.error("[API] Profile validation failed:", result.error.issues);
  return result.success ? result.data : null;
}

export async function getTools() {
  const data = await fetchJson<unknown>("tools");
  if (!data) return { categories: [] };
  const result = techStackSchema.safeParse(data);
  if (!result.success) console.error("[API] Tools validation failed:", result.error.issues);
  return result.success ? result.data : { categories: [] };
}

export async function getVideos() {
  const data = normalizeVideos(await fetchJson<unknown>("videos"));
  const result = z.array(videoSchema).safeParse(data);
  if (!result.success) console.error("[API] Videos validation failed:", result.error.issues);
  return result.success ? result.data : [];
}

const api = {
  getDocuments,
  getExperience,
  getEducation,
  getProfile,
  getOrganisations,
  getVolunteering,
  getSocials,
  getTools,
  getAwards,
  getVideos,
};

export default api;