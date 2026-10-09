// src/content/config.ts
import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";
import {
  assetSchema as brandAssetSchema,
  docSchema as brandDocSchema,
  siteProfileSchema as brandSiteSchema,
} from "./brand/lib/schemas";

const optionalUrl = z.preprocess(
  (value) => (value === "" || value == null ? undefined : value),
  z.url().optional(),
);

const stringArray = z.array(z.string()).default([]);

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
  sectors: stringArray,

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

const workSchema = baseSchema.extend({
  title: z.string(),
  summary: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(["active", "completed", "archived"]).optional(),
  year: z.union([z.string(), z.number()]).optional(),
});

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

const insightSchema = baseSchema.extend({
  title: z.string(),
  summary: z.string().optional(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  readingTime: z.number().optional(),
  series: z.string().optional(),
});

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

  organiser: z.union([z.string(), z.array(eventOrganiserSchema)]).optional(),
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

const researchThemeEnum = z.enum([
  "earth-observation",
  "astronomy",
  "space-sustainability",
  "climate-data",
  "science-communication",
  "digital-research-systems",
]);

export const collections = {
  /**
   * WORK
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
   * SERVICES
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
   * Public routes:
   * - /insights/blog/
   * - /insights/research/
   * - /insights/podcasts/
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

  events: defineCollection({
    loader: glob({
      pattern: "**/*.{md,mdx}",
      base: "./src/content/work/events",
    }),
    schema: eventSchema,
  }),

  /**
   * ABOUT
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
