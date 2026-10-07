// src/content/config.ts
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { file } from "astro/loaders";
import { assetSchema as brandAssetSchema, docSchema as brandDocSchema, siteProfileSchema as brandSiteSchema } from "./brand/lib/schemas";

// Helper to safely handle empty string frontmatter fields for URLs
const optionalUrl = z.preprocess(
  (val) => (val === "" || val == null ? undefined : val),
  z.url().optional()
);

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

// Rich related video (aligned with the updated object structure using publishedDate)
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
  relatedPodcasts: z.array(z.string()).default([]),
  relatedExperience: z.array(z.string()).default([]),
  relatedInitiatives: z.array(z.string()).default([]),
  relatedEvents: z.array(z.string()).default([]),
  video_type: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

// Rich related article / news item (like your ESA example)
const relatedArticleSchema = z.object({
  title: z.string().optional(),
  url: optionalUrl,
  image: z.string().optional(),
  imageCredit: z.string().optional(),
  topics: z.array(z.string()).default([]),
  excerpt: z.string().optional(),
  date: z.coerce.date().optional(),
  publication: z.string().optional(),
});

const baseSchema = seoSchema.extend({
  id: z.union([z.string(), z.number()]).optional(),
  slug: z.string().optional(),
  updatedDate: z.coerce.date().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  author: z.string().optional(),
  tags: z.array(z.string()).default([]),
  sectors: z.array(z.string()).default([]),
  youtubeId: z.string().optional(),
  category: z
    .preprocess(
      (val) => {
        if (val == null) return [];
        if (Array.isArray(val)) return val;
        return [val];
      },
      z.array(z.string())
    )
    .default([]),
  links: z
    .object({
      github: optionalUrl,
      web: optionalUrl,
      demo: optionalUrl,
      docs: optionalUrl,
      youtube: optionalUrl,
      store: optionalUrl,
      api: optionalUrl,
    })
    .optional()
    .default({}),
  heroImage: z.string().optional(),
  heroAlt: z.string().optional(),
  relatedOrg: z.array(z.string()).default([]),
  relatedExperience: z.array(z.string()).default([]),
  relatedEducation: z.array(z.string()).default([]),
  relatedVolunteering: z.array(z.string()).default([]),
  relatedAwards: z.array(z.string()).default([]),
  relatedTools: z.array(z.string()).default([]),
  relatedSkills: z.array(z.string()).default([]),

  // Keep existing string-ID based relatedVideos for backwards compatibility
  relatedVideos: z.array(z.string()).default([]),

  relatedCaseStudies: z.array(z.string()).default([]),
  relatedInitiatives: z.array(z.string()).default([]),
  relatedProjects: z.array(z.string()).default([]),

  // New: rich related videos and articles
  relatedVideosRich: z.array(relatedVideoSchema).default([]),
  relatedArticles: z.array(relatedArticleSchema).default([]),

  // New: related events (IDs)
  relatedEvents: z.array(z.string()).default([]),

  client: z.string().optional(),
  organisation: z.string().optional(),
  institution: z.string().optional(),
  tools_tech: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  impact: z.record(z.string(), z.unknown()).optional(),

  // Case-study model (all optional so existing entries still validate).
  // Set evidenceReady: true only once the entry has real context, role and outcomes.
  evidenceReady: z.boolean().optional(),
  role: z.string().optional(),
  collaborators: z.array(z.string()).default([]),
  challenge: z.string().optional(),
  objectives: z.array(z.string()).default([]),
  approach: z.string().optional(),
  outputs: z.array(z.string()).default([]),
  outcomes: z.string().optional(),
  testimonial: z
    .object({ quote: z.string(), name: z.string(), role: z.string().optional(), permission: z.boolean().default(false) })
    .optional(),
});

const podcastSchema = baseSchema.extend({
  podcastTitle: z.string().optional(),
  podcastDescription: z.string().optional(),
  podcastWebsite: optionalUrl,
  podcastFeedUrl: optionalUrl,
  podcastPublisher: z.string().optional(),
  podcastLanguage: z.string().optional(),
  podcastCoverImage: z.string().optional(),
  podcastCategories: z.array(z.string()).default([]),
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
        podcastCategories: z.array(z.string()).default([]),
        podcastApplePodcasts: optionalUrl,
        podcastSpotify: optionalUrl,
        podcastYouTube: optionalUrl,
      })
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
  speakers: z.array(z.string()).default([]),
  hosts: z.array(z.string()).default([]),

  description: z.string().optional(),
  agenda: z.array(z.string()).default([]),
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

  links: z
    .object({
      github: optionalUrl,
      web: optionalUrl,
      demo: optionalUrl,
      docs: optionalUrl,
      youtube: optionalUrl,
      store: optionalUrl,
      api: optionalUrl,
      eventPage: optionalUrl,
      meetup: optionalUrl,
      luMa: optionalUrl,
    })
    .optional()
    .default({}),
});

const researchThemeEnum = z.enum(["earth-observation", "astronomy", "space-sustainability", "climate-data", "science-communication", "digital-research-systems"]);

const researchNoteSchema = z.object({
  title: z.string(),
  summary: z.string(),
  kind: z.enum(["literature", "methods", "research-log"]),
  tags: z.array(z.string()).default([]),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  draft: z.boolean().default(true),
});

export const collections = {
  blog: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
    schema: baseSchema.extend({
      pubDate: z.coerce.date(),
    }),
  }),

  projects: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
    schema: baseSchema.extend({
      type: z.string().optional(),
      status: z.string().optional(),
    }),
  }),

  initiatives: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/initiatives" }),
    schema: baseSchema.extend({
      type: z.string().optional(),
      status: z.string().optional(),
    }),
  }),

  caseStudies: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/case-studies" }),
    schema: baseSchema.extend({
      type: z.string().optional(),
      status: z.string().optional(),
    }),
  }),

  authors: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/authors" }),
    schema: z.object({
      name: z.string(),
      bio: z.string().optional(),
      avatar: z.string().optional(),
      role: z.string().optional(),
      website: optionalUrl,
    }),
  }),

  podcasts: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/podcasts" }),
    schema: podcastSchema,
  }),

  events: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/events" }),
    schema: eventSchema,
  }),

  // Guide sections migrated from the mentoring.* and coaching.* MkDocs sites.
  // `draft: true` keeps a page noindex and out of the sitemap until the copy is final.
  mentoring: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/mentoring" }),
    schema: z.object({ title: z.string(), draft: z.boolean().default(true) }),
  }),

  coaching: defineCollection({
    loader: glob({ pattern: "**/*.md", base: "./src/content/coaching" }),
    schema: z.object({ title: z.string(), draft: z.boolean().default(true) }),
  }),

  // Research lab (migrated from research.rjmlaird.co.uk). All content is draft/noindex until reviewed.
  researchProjects: defineCollection({
    loader: glob({ pattern: "*.md", base: "./src/content/research/projects" }),
    schema: z.object({
      title: z.string(),
      summary: z.string(),
      status: z.enum(["idea", "in-progress", "completed", "archived"]),
      startedAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date(),
      featured: z.boolean().default(false),
      themes: z.array(researchThemeEnum).min(1),
      methods: z.array(z.string()).default([]),
      tools: z.array(z.string()).default([]),
      researchQuestions: z.array(z.string()).min(1),
      whyItMatters: z.string(),
      dataSources: z
        .array(z.object({ name: z.string(), url: z.string().url().optional(), licence: z.string().optional(), accessedAt: z.coerce.date().optional() }))
        .default([]),
      outputs: z
        .array(
          z.object({
            type: z.enum(["publication", "preprint", "poster", "presentation", "report", "dataset", "software", "visualisation", "notebook"]),
            title: z.string(),
            url: z.string().url().optional(),
            state: z.enum(["planned", "available"]).default("planned"),
          }),
        )
        .default([]),
      progress: z.string(),
      limitations: z.array(z.string()).min(1),
      reproducibility: z.string(),
      reproducibilityUrl: z.string().url().optional(),
      licence: z.string().optional(),
      relatedArticles: z.array(z.object({ label: z.string(), url: z.string().url() })).default([]),
      citation: z.string().optional(),
      draft: z.boolean().default(true),
    }),
  }),

  researchMethods: defineCollection({
    loader: glob({ pattern: "*.md", base: "./src/content/research/methods" }),
    schema: z.object({ title: z.string(), summary: z.string(), updatedAt: z.coerce.date(), tools: z.array(z.string()).default([]), draft: z.boolean().default(true) }),
  }),

  researchNotebooks: defineCollection({
    loader: glob({ pattern: "*.md", base: "./src/content/research/notebooks" }),
    schema: z.object({
      title: z.string(),
      summary: z.string(),
      area: z.enum(["earth-observation", "astronomy", "climate", "methods"]),
      state: z.enum(["planned", "in-progress", "available"]),
      project: z.string().optional(),
      repositoryUrl: z.string().url().optional(),
      tools: z.array(z.string()).default([]),
      updatedAt: z.coerce.date(),
      draft: z.boolean().default(true),
    }),
  }),

  researchNotes: defineCollection({
    loader: glob({ pattern: "*.md", base: "./src/content/research/notes" }),
    schema: researchNoteSchema,
  }),

  // Brand system (migrated from brand.rjmlaird.co.uk).
  brandDocs: defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/brand/docs" }),
    schema: brandDocSchema,
  }),
  brandAssets: defineCollection({ loader: file("src/brand/data/asset-manifest.json"), schema: brandAssetSchema }),
  brandSites: defineCollection({ loader: file("src/brand/data/site-profiles.json"), schema: brandSiteSchema }),
};
