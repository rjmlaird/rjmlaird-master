// src/lib/routes.ts
// Single source of truth for internal URLs and site navigation. Components must build hrefs
// here rather than hard-coding paths, so a moved route is a one-line fix.
//
// Three kinds of destination live here:
//   1. internal section routes   -> `routes`
//   2. dynamic detail routes     -> `entryHref(kind, id)` and friends (collection names and
//                                   public URLs are NOT assumed to match)
//   3. external sites/apps       -> `external`
// The future curated showcase is kept apart in `showcase` and is never linked until `live` is true.
import { slugify } from "../utils/slugify";

export type EntryKind =
  | "blog"
  | "resource"
  | "podcast"
  | "project"
  | "initiative"
  | "caseStudy"
  | "event"
  | "video"
  | "build";

export const routes = {
  home: "/",

  // Work (portfolio)
  work: "/work/",
  projects: "/work/projects/",
  initiatives: "/work/initiatives/",
  caseStudies: "/work/case-studies/",
  events: "/work/events/",
  videos: "/work/videos/",
  editorial: "/work/editorial/",
  research: "/research/",
  publications: "/research/publications/",
  dev: "/dev/",
  builds: "/builds/",

  // Insights
  insights: "/insights/",
  blog: "/insights/blog/",
  resources: "/insights/resources/",
  podcasts: "/insights/podcasts/",
  sectors: "/sectors/",
  substack: "/insights/substack/",

  // Browse
  tags: "/tags/",
  categories: "/category/",

  // Services, about, contact
  services: "/services/",
  howIWork: "/how-i-work/",
  about: "/about/",
  bio: "/about/bio/",
  organisations: "/about/organisations/",
  press: "/about/press/",
  brand: "/about/brand/",
  contact: "/contact/",
  faq: "/faq/",

  // Legal
  privacy: "/privacy/",
  terms: "/terms-of-use/",
  disclaimer: "/disclaimer/",
  accessibility: "/accessibility/",

  cv: "https://cv.rjmlaird.co.uk/",
} as const;

/** External websites and applications that belong to this site's ecosystem. */
export const external = {
  cv: "https://cv.rjmlaird.co.uk/",
  docs: "https://docs.rjmlaird.co.uk",
  tools: "https://tools.rjmlaird.co.uk",
  apps: "https://apps.rjmlaird.co.uk",
  labs: "https://labs.rjmlaird.co.uk",
  booking: "https://booking.rjmlaird.co.uk",
  substack: "https://rjmlaird.substack.com/",
  api: "https://api.rjmlaird.co.uk",
  impactOrbit: "https://impactorbit.co",
  spaceForNeurodiversity: "https://spaceforneurodiversity.org",
} as const;

/**
 * The separate, curated showcase. Not built yet: nothing may link to it unless `live` is true.
 * Flip `live` when portfolio.rjmlaird.co.uk is deployed.
 */
export const showcase = {
  live: false,
  label: "Selected showcase",
  href: "https://portfolio.rjmlaird.co.uk/",
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
  build: routes.builds,
};

export const listHref = (kind: EntryKind) => base[kind];
export const entryHref = (kind: EntryKind, id: string) => `${base[kind]}${id}/`;
export const tagHref = (tag: string) => `${routes.tags}${slugify(tag)}/`;
export const categoryHref = (category: string) => `${routes.categories}${slugify(category)}/`;
export const sectorHref = (sector: string) => `${routes.sectors}${slugify(sector)}/`;
export const cvHref = (id?: string) => (id ? `${routes.cv}#${id}` : routes.cv);
export const brandHref = (path = "") =>
  path ? `${routes.brand}${path.replace(/^\/+|\/+$/g, "")}/` : routes.brand;

/* ---------------------------------------------------------------------------
   Navigation. Primary nav, footer and breadcrumb section lookups all read from here.
   --------------------------------------------------------------------------- */

export type NavLink = {
  label: string;
  href: string;
  external?: boolean;
  children?: NavLink[];
};

export const primaryNav: NavLink[] = [
  {
    label: "Work",
    href: routes.work,
    children: [
      { label: "Case studies", href: routes.caseStudies },
      { label: "Projects", href: routes.projects },
      { label: "Initiatives", href: routes.initiatives },
      { label: "Research", href: routes.research },
      { label: "Events", href: routes.events },
      { label: "Podcasts", href: routes.podcasts },
      { label: "Videos", href: routes.videos },
      { label: "Editorial", href: routes.editorial },
      { label: "Development & systems", href: routes.dev },
      { label: "Builds", href: routes.builds },
    ],
  },
  {
    label: "Services",
    href: routes.services,
    children: [
      { label: "Strategic communication", href: `${routes.services}strategic-communication/` },
      { label: "Digital strategy & systems", href: `${routes.services}digital-strategy-systems/` },
      { label: "Teaching & mentoring", href: `${routes.services}teaching-mentoring/` },
      { label: "Speaking & collaboration", href: `${routes.services}speaking-collaboration/` },
      { label: "How I work", href: routes.howIWork },
    ],
  },
  {
    label: "Insights",
    href: routes.insights,
    children: [
      { label: "Blog", href: routes.blog },
      { label: "Signal & Noise newsletter", href: routes.substack },
      { label: "Sectors", href: routes.sectors },
    ],
  },
  {
    label: "About",
    href: routes.about,
    children: [
      { label: "Biography", href: routes.bio },
      { label: "Organisations & initiatives", href: routes.organisations },
      { label: "Press & media", href: routes.press },
    ],
  },
];

export const utilityNav: NavLink[] = [{ label: "CV", href: external.cv, external: true }];

export const ctaNav: NavLink = { label: "Start a conversation", href: routes.contact };

export type FooterGroup = { title: string; links: NavLink[] };

export const footerNav: FooterGroup[] = [
  {
    title: "Explore",
    links: [
      { label: "Work", href: routes.work },
      { label: "Research", href: routes.research },
      { label: "Builds", href: routes.builds },
      { label: "Insights", href: routes.insights },
      ...(showcase.live ? [{ label: showcase.label, href: showcase.href, external: true }] : []),
    ],
  },
  {
    title: "Services",
    links: primaryNav.find((l) => l.label === "Services")?.children ?? [],
  },
  {
    title: "Platforms",
    links: [
      { label: "Docs", href: external.docs },
      { label: "Tools", href: external.tools },
      { label: "Apps", href: external.apps },
      { label: "Labs", href: external.labs },
    ],
  },
  {
    title: "Work with me",
    links: [
      { label: "Contact", href: routes.contact },
      { label: "Booking Portal", href: external.booking },
      { label: "Impact Orbit Co.", href: external.impactOrbit, external: true },
      { label: "Space for Neurodiversity", href: external.spaceForNeurodiversity, external: true },
    ],
  },
];

export const legalNav: NavLink[] = [
  { label: "Privacy policy", href: routes.privacy },
  { label: "Terms of use", href: routes.terms },
  { label: "Disclaimer", href: routes.disclaimer },
  { label: "API", href: external.api, external: true },
];
