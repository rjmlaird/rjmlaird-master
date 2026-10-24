import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

import {
  assetSchema as brandAssetSchema,
  docSchema as brandDocSchema,
  siteProfileSchema as brandSiteSchema,
} from "./brand/lib/schemas";

import { faqs } from "./lib/faq-collection";

/**
 * SHARED HELPERS
 */

const optionalUrl = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.url().optional(),
);

const stringArray = z.array(z.string()).default([]);

/**
 * SEO
 */

const seoSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  excerpt: z.string().optional(),
  image: z.string().optional(),
  imageCredit: z.string().optional(),
  canonical: optionalUrl,
  noindex: z.boolean().default(false),
  nofollow: z.boolean().default(false),
});

/**
 * SHARED RELATED CONTENT
 */

const relatedItemSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  guest: z.string().optional(),
  host: z.string().optional(),
  season: z.union([z.string(), z.number()]).optional(),
  episodeNumber: z.union([z.string(), z.number()]).optional(),
  publishedDate: z.coerce.date().optional(),
  duration: z.string().optional(),
  audioUrl: optionalUrl,
  shareUrl: optionalUrl,
  transcriptUrl: optionalUrl,
  artwork: z.string().optional(),
  summary: z.string().optional(),
});

const relatedVideoSchema = z.object({
  slug: z.string(),
  youtubeId: z.string().optional(),
  title: z.string().optional(),
  url: optionalUrl,
  publishedDate: z.coerce.date().optional(),
  client: z.string().optional(),
  organisation: z.string().optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  credits: z.string().optional(),
  heroImage: z.string().optional(),
  heroAlt: z.string().optional(),
  imageCredit: z.string().optional(),

  relatedPodcasts: stringArray,
  relatedExperience: stringArray,
  relatedInitiatives: stringArray,
  relatedEvents: stringArray,

  videoType: z.string().optional(),
  tags: stringArray,
});

const relatedArticleSchema = z.object({
  title: z.string().optional(),
  url: optionalUrl,
  image: z.string().optional(),
  imageCredit: z.string().optional(),
  topics: stringArray,
  excerpt: z.string().optional(),
  date: z.coerce.date().optional(),
  publication: z.string().optional(),
});

/**
 * SHARED SUPPORTING CONTENT
 */

const testimonialSchema = z.object({
  quote: z.string(),
  name: z.string(),
  role: z.string().optional(),
  organisation: z.string().optional(),
  permission: z.boolean().default(false),
});

const externalLinkSchema = z.object({
  label: z.string(),
  url: optionalUrl,
});

const linksSchema = z.object({
  github: optionalUrl,
  web: optionalUrl,
  demo: optionalUrl,
  docs: optionalUrl,
  youtube: optionalUrl,
  store: optionalUrl,
  api: optionalUrl,
});

/**
 * SECTORS
 *
 * A controlled vocabulary shared by blog posts, projects,
 * initiatives, case studies, events and builds.
 *
 * Sector IDs must match the `id` value in:
 * src/content/sectors/*.md
 *
 * Use a sector only when it is central to the work.
 * A content entry may have zero, one or several sectors.
 */

export const sectorIdSchema = z
  .string()
  .trim()
  .min(1)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Sector IDs must be lowercase kebab-case.",
  );

export const sectorIds = [
  "automotive",
  "built-environment",
  "climate",
  "education",
  "energy",
  "environment",
  "fisheries",
  "health",
  "logistics",
  "marine",
  "space",
] as const;


export type SectorId = (typeof sectorIds)[number];

export const sectorReferenceSchema = z
  .union([sectorIdSchema, z.string()])
  .transform((value) => value.trim().toLowerCase())
  .refine(
    (value): value is SectorId =>
      (sectorIds as readonly string[]).includes(value),
    {
      message:
        "Unknown sector. Use one of the IDs defined in src/content/sectors/.",
    },
  );

export const sectorReferencesSchema = z
  .array(sectorReferenceSchema)
  .default([])
  .transform((values) => Array.from(new Set(values)));

const sectorSchema = z.object({
  id: sectorIdSchema,
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),

  order: z.number().int().default(0),
  status: z.enum(["active", "archived"]).default("active"),

  related: sectorReferencesSchema,
  excludes: stringArray,

  heroImage: z.string().optional(),
  heroAlt: z.string().optional(),
});

/**
 * BASE CONTENT
 *
 * Shared metadata, media, relationships and work-related fields.
 */

const baseSchema = seoSchema.extend({
  id: z.union([z.string(), z.number()]).optional(),
  slug: z.string().optional(),

  draft: z.boolean().default(false),
  featured: z.boolean().default(false),

  publishedDate: z.coerce.date().optional(),
  updatedDate: z.coerce.date().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),

  author: z.string().optional(),

  tags: stringArray,
  sectors: sectorReferencesSchema,

  category: z
    .preprocess(
      (value) => {
        if (value == null) return [];
        return Array.isArray(value) ? value : [value];
      },
      z.array(z.string()),
    )
    .default([]),

  links: linksSchema.optional().default({}),

  heroImage: z.string().optional(),
  heroAlt: z.string().optional(),
  youtubeId: z.string().optional(),

  client: z.string().optional(),
  organisation: z.string().optional(),
  institution: z.string().optional(),
  collaborators: stringArray,

  relatedOrg: stringArray,
  relatedExperience: stringArray,
  relatedEducation: stringArray,
  relatedVolunteering: stringArray,
  relatedAwards: stringArray,
  relatedTools: stringArray,
  relatedSkills: stringArray,

  relatedVideos: stringArray,
  relatedVideosRich: z.array(relatedVideoSchema).default([]),
  relatedArticles: z.array(relatedArticleSchema).default([]),

  relatedCaseStudies: stringArray,
  relatedInitiatives: stringArray,
  relatedProjects: stringArray,
  relatedEvents: stringArray,

  toolsTech: stringArray,
  features: stringArray,
  impact: z.record(z.string(), z.unknown()).optional(),

  evidenceReady: z.boolean().default(false),
  role: z.string().optional(),
  challenge: z.string().optional(),
  objectives: stringArray,
  approach: z.string().optional(),
  outputs: stringArray,
  outcomes: z.string().optional(),

  testimonial: testimonialSchema.optional(),
});

/**
 * WORK
 */

const workSchema = baseSchema.extend({
  title: z.string(),
  summary: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(["active", "completed", "archived"]).optional(),
  year: z.union([z.string(), z.number()]).optional(),
});

/**
 * BUILDS
 *
 * Public-facing pages for labs, tools and apps on the main website.
 *
 * These entries explain:
 * - what a build does;
 * - who it is for;
 * - its features and use cases;
 * - its availability, maturity and limitations;
 * - where to launch it or find supporting material.
 *
 * Content boundaries:
 * - Main website: discovery, overview and evaluation.
 * - docs.rjmlaird.co.uk: usage guides and reference documentation.
 * - Repository: installation, development and contribution instructions.
 * - Blog: development stories, reasoning and lessons.
 * - Work: broader project context, responsibilities and outcomes.
 */

const buildTypeEnum = z.enum(["lab", "tool", "app"]);

const buildStatusEnum = z.enum([
  "planned",
  "active",
  "maintenance",
  "paused",
  "retired",
  "archived",
]);

const buildStageEnum = z.enum([
  "concept",
  "prototype",
  "alpha",
  "beta",
  "stable",
]);

const buildPlatformEnum = z.enum([
  "web",
  "desktop",
  "mobile",
  "cli",
  "api",
  "library",
  "browser-extension",
  "hardware",
  "other",
]);

const buildAccessEnum = z.enum([
  "public",
  "signup",
  "invite-only",
  "private",
  "unavailable",
]);

const buildPricingEnum = z.enum([
  "free",
  "freemium",
  "paid",
  "mixed",
  "not-applicable",
]);

const buildScreenshotSchema = z.object({
  src: z.string().trim().min(1),
  alt: z.string().trim().min(1),
  caption: z.string().optional(),
  credit: z.string().optional(),
});

const buildUseCaseSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

const buildCtaSchema = z.object({
  label: z.string().trim().min(1),
  href: z.string().trim().min(1),
});

const buildReplacementSchema = z.object({
  title: z.string().trim().min(1),
  href: z.string().trim().min(1),
});

const buildLinksSchema = linksSchema.extend({
  repository: optionalUrl,
  download: optionalUrl,
  releases: optionalUrl,
  issues: optionalUrl,
  support: optionalUrl,
  privacy: optionalUrl,
  terms: optionalUrl,
});

const buildSchema = baseSchema.extend({
  // Identity and discovery
  title: z.string().trim().min(1),
  summary: z.string().trim().min(1),
  tagline: z.string().optional(),

  type: buildTypeEnum,
  platforms: z.array(buildPlatformEnum).default([]),

  // Maintenance state and product maturity are independent.
  status: buildStatusEnum.default("active"),
  stage: buildStageEnum.default("prototype"),

  launchedDate: z.coerce.date().optional(),
  retiredDate: z.coerce.date().optional(),

  // Audience and purpose
  audience: stringArray,
  problem: z.string().optional(),
  useCases: z.array(buildUseCaseSchema).default([]),

  // Availability and pricing
  access: buildAccessEnum.default("public"),
  pricing: buildPricingEnum.default("free"),

  // Concise public-facing information, not full documentation.
  requirements: stringArray,
  limitations: stringArray,

  // Code availability is separate from price and hosted access.
  sourceAvailability: z
    .enum(["open-source", "source-available", "closed-source"])
    .optional(),

  license: z.string().optional(),

  // Media
  screenshots: z.array(buildScreenshotSchema).default([]),

  // Local paths and absolute URLs are both permitted.
  primaryCta: buildCtaSchema.optional(),

  // Destinations for the application and supporting material.
  links: buildLinksSchema.optional().default({}),

  // Existing work relationships are inherited from baseSchema.
  relatedBuilds: stringArray,
  relatedInsights: stringArray,

  // Optional successor for a retired or superseded build.
  replacement: buildReplacementSchema.optional(),
});

/**
 * SERVICES
 */

const serviceSchema = seoSchema.extend({
  title: z.string(),
  summary: z.string().optional(),
  description: z.string().optional(),

  draft: z.boolean().default(false),
  featured: z.boolean().default(false),

  heroImage: z.string().optional(),
  heroAlt: z.string().optional(),

  audience: stringArray,
  outcomes: stringArray,
  formats: stringArray,
  topics: stringArray,

  relatedWork: stringArray,
  relatedInsights: stringArray,
  relatedServices: stringArray,

  contactCtaLabel: z.string().optional(),
  contactCtaHref: z.string().optional().default("/contact/"),
});

/**
 * INSIGHTS
 */

const insightSchema = baseSchema.extend({
  title: z.string(),
  summary: z.string().optional(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  readingTime: z.number().optional(),
  series: z.string().optional(),
});

/**
 * PODCASTS
 */

const podcastSchema = baseSchema.extend({
  title: z.string(),

  podcastTitle: z.string().optional(),
  podcastDescription: z.string().optional(),
  podcastWebsite: optionalUrl,
  podcastFeedUrl: optionalUrl,
  podcastPublisher: z.string().optional(),
  podcastLanguage: z.string().optional(),
  podcastCoverImage: z.string().optional(),
  podcastCategories: stringArray,
  podcastApplePodcasts: optionalUrl,
  podcastSpotify: optionalUrl,
  podcastYouTube: optionalUrl,

  host: z.string().optional(),
  guest: z.string().optional(),
  season: z.union([z.string(), z.number()]).optional(),
  episodeNumber: z.union([z.string(), z.number()]).optional(),
  publishedDate: z.coerce.date().optional(),
  duration: z.string().optional(),
  transcriptUrl: optionalUrl,
  shareUrl: optionalUrl,
  audioUrl: optionalUrl,
  artwork: z.string().optional(),
  summary: z.string().optional(),

  relatedEpisodes: z.array(relatedItemSchema).default([]),

  relatedPodcasts: z
    .array(
      z.object({
        id: z.union([z.string(), z.number()]).optional(),
        title: z.string().optional(),
        description: z.string().optional(),

        podcastTitle: z.string().optional(),
        podcastDescription: z.string().optional(),
        podcastWebsite: optionalUrl,
        podcastFeedUrl: optionalUrl,
        podcastPublisher: z.string().optional(),
        podcastLanguage: z.string().optional(),
        podcastCoverImage: z.string().optional(),
        podcastCategories: stringArray,
        podcastApplePodcasts: optionalUrl,
        podcastSpotify: optionalUrl,
        podcastYouTube: optionalUrl,
      }),
    )
    .default([]),
});

/**
 * EVENTS
 */

const eventLocationSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  country: z.string().optional(),
  postalCode: z.string().optional(),
  online: z.boolean().default(false),
  onlineUrl: optionalUrl,
});

const eventOrganiserSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
  organisation: z.string().optional(),
  website: optionalUrl,
  email: z.string().optional(),
});

const eventSchema = baseSchema.extend({
  title: z.string(),

  type: z
    .enum([
      "networking",
      "workshop",
      "conference",
      "webinar",
      "hackathon",
      "talk",
      "panel",
      "other",
    ])
    .optional(),

  status: z
    .enum(["draft", "announced", "ongoing", "completed", "cancelled"])
    .default("announced"),

  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional(),
  timezone: z.string().optional(),
  registrationDeadline: z.coerce.date().optional(),

  location: eventLocationSchema.optional(),
  locationEmbedUrl: optionalUrl,
  format: z.enum(["in-person", "online", "hybrid"]).optional(),

  organiser: z
    .union([z.string(), z.array(eventOrganiserSchema)])
    .optional(),

  coOrganisers: z.array(eventOrganiserSchema).default([]),
  speakers: stringArray,
  hosts: stringArray,

  description: z.string().optional(),
  agenda: stringArray,
  capacity: z.number().int().positive().optional(),
  attendees: z.number().int().nonnegative().optional(),

  ticketUrl: optionalUrl,
  registrationUrl: optionalUrl,
  ticketPrice: z.string().optional(),

  eventLogo: z.string().optional(),
  eventBanner: z.string().optional(),
  recordingUrl: optionalUrl,
  slidesUrl: optionalUrl,
  photosUrl: optionalUrl,

  links: linksSchema
    .extend({
      eventPage: optionalUrl,
      meetup: optionalUrl,
      luMa: optionalUrl,
    })
    .optional()
    .default({}),
});

/**
 * COLLECTIONS
 */

export const collections = {
  faqs,

  /**
   * SECTORS
   *
   * Controlled vocabulary for cross-cutting sector classification.
   *
   * Content directory:
   * - src/content/sectors/
   *
   * Public routes:
   * - /sectors/
   * - /sectors/[id]/
   *
   * Do not create a sector page merely because a sector exists.
   * A sector page is useful when it has enough distinct content
   * to justify a destination.
   */

  sectors: defineCollection({
    loader: glob({
      pattern: "**/*.md",
      base: "./src/content/sectors",
    }),
    schema: sectorSchema,
  }),

  /**
   * WORK
   *
   * Public routes:
   * - /work/case-studies/
   * - /work/projects/
   * - /work/initiatives/
   */

  caseStudies: defineCollection({
    loader: glob({
      pattern: "**/*.{md,mdx}",
      base: "./src/content/work/case-studies",
    }),
    schema: workSchema,
  }),

  projects: defineCollection({
    loader: glob({
      pattern: "**/*.{md,mdx}",
      base: "./src/content/work/projects",
    }),
    schema: workSchema,
  }),

  initiatives: defineCollection({
    loader: glob({
      pattern: "**/*.{md,mdx}",
      base: "./src/content/work/initiatives",
    }),
    schema: workSchema,
  }),

  /**
   * BUILDS
   *
   * Intended public routes:
   * - /builds/
   * - /builds/[slug]/
   *
   * Optional filtered listings:
   * - /builds/labs/
   * - /builds/tools/
   * - /builds/apps/
   *
   * Content directory:
   * - src/content/builds/
   *
   * One entry per build, with type used for filtering.
   * Route templates are defined separately from this collection.
   */

  builds: defineCollection({
    loader: glob({
      pattern: "**/*.{md,mdx}",
      base: "./src/content/builds",
    }),
    schema: buildSchema,
  }),

  /**
   * SERVICES
   *
   * Content directories:
   * - src/content/services/strategy/
   * - src/content/services/communications/
   * - src/content/services/sustainability/
   * - src/content/services/digital-systems/
   * - src/content/services/speaking-workshops/
   * - src/content/services/mentoring/
   * - src/content/services/tutoring/
   *
   * Tutoring is a service area, but its public pages can remain under
   * /tutoring/ if that is the appropriate audience-facing URL.
   */

  services: defineCollection({
    loader: glob({
      pattern: "**/*.{md,mdx}",
      base: "./src/content/services",
    }),
    schema: serviceSchema,
  }),

  /**
   * INSIGHTS
   *
   * Existing public content:
   * - /insights/blog/
   * - /insights/podcasts/
   *
   * No research collection is registered here.
   */

  blog: defineCollection({
    loader: glob({
      pattern: "**/*.{md,mdx}",
      base: "./src/content/insights/blog",
    }),
    schema: insightSchema,
  }),

  podcasts: defineCollection({
    loader: glob({
      pattern: "**/*.{md,mdx}",
      base: "./src/content/insights/podcasts",
    }),
    schema: podcastSchema,
  }),

  /**
   * EVENTS
   */

  events: defineCollection({
    loader: glob({
      pattern: "**/*.{md,mdx}",
      base: "./src/content/work/events",
    }),
    schema: eventSchema,
  }),

  /**
   * ABOUT
   *
   * Keep author profiles only if multiple contributors are genuinely used.
   */

  authors: defineCollection({
    loader: glob({
      pattern: "**/*.{md,mdx}",
      base: "./src/content/about/authors",
    }),
    schema: z.object({
      name: z.string(),
      bio: z.string().optional(),
      avatar: z.string().optional(),
      role: z.string().optional(),
      website: optionalUrl,
      links: z.array(externalLinkSchema).default([]),
    }),
  }),

  /**
   * BRAND SYSTEM
   *
   * Retained as an internal/specialist documentation area.
   */

  brandDocs: defineCollection({
    loader: glob({
      pattern: "**/*.{md,mdx}",
      base: "./src/content/brand/docs",
    }),
    schema: brandDocSchema,
  }),

  brandAssets: defineCollection({
    loader: file("src/brand/data/asset-manifest.json"),
    schema: brandAssetSchema,
  }),

  brandSites: defineCollection({
    loader: file("src/brand/data/site-profiles.json"),
    schema: brandSiteSchema,
  }),
};
