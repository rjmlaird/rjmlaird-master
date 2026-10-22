// src/lib/routes.ts
// Single source of truth for internal URLs. Components must build hrefs
// here rather than hard-coding paths, so a moved route is a one-line fix.
import { slugify } from "../utils/slugify";

export type EntryKind =
  | "blog"
  | "resource"
  | "podcast"
  | "project"
  | "initiative"
  | "caseStudy"
  | "event"
  | "video";

export const routes = {
  home: "/",
  blog: "/insights/blog/",
  resources: "/insights/resources/",
  podcasts: "/insights/podcasts/",
  sectors: "/insights/sectors/",
  tags: "/tags/",
  categories: "/category/",
  projects: "/work/projects/",
  initiatives: "/work/initiatives/",
  caseStudies: "/work/case-studies/",
  events: "/work/events/",
  videos: "/work/videos/",
  cv: "https://cv.rjmlaird.co.uk/",
} as const;

const base: Record<EntryKind, string> = {
  blog: routes.blog,
  resource: routes.resources,
  podcast: routes.podcasts,
  project: routes.projects,
  initiative: routes.initiatives,
  caseStudy: routes.caseStudies,
  event: routes.events,
  video: routes.videos,
};

export const listHref = (kind: EntryKind) => base[kind];
export const entryHref = (kind: EntryKind, id: string) => `${base[kind]}${id}/`;
export const tagHref = (tag: string) => `${routes.tags}${slugify(tag)}/`;
export const categoryHref = (category: string) => `${routes.categories}${slugify(category)}/`;
export const sectorHref = (sector: string) => `${routes.sectors}${slugify(sector)}/`;
export const cvHref = (id?: string) => (id ? `${routes.cv}#${id}` : routes.cv);
