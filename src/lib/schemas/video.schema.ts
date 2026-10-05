import { z } from "zod";

export const videoSchema = z.object({
  title: z.string(),
  youtubeId: z.string().transform((val) => val.replace(/^v=/, "")),
  slug: z.string().optional(),
  url: z.string().optional(),
  published: z.string().optional(),
  client: z.string().optional(),
  organisation: z.string().optional(),
  summary: z.string().optional(),
  description: z.string().optional(),
  production_credit: z.string().optional(),
  thumbnail_image: z.string().optional(),
  video_type: z.string().optional(),
  tags: z.array(z.string()).optional(),
  sectors: z.array(z.string()).optional(),
  tools_tech: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  impact: z.record(z.string(), z.any()).optional(),
  links: z.record(z.string(), z.string()).optional(),
  relatedExperience: z.array(z.string()).optional(),
  relatedEducation: z.array(z.string()).optional(),
  relatedOrg: z.array(z.string()).optional(),
  relatedVolunteering: z.array(z.string()).optional(),
  relatedAwards: z.array(z.string()).optional(),
  relatedCaseStudies: z.array(z.string()).optional(),
  relatedInitiatives: z.array(z.string()).optional(),
  relatedVideos: z.array(z.string()).optional(),
}).transform((data) => ({
  ...data,
  slug: data.slug && data.slug.trim()
    ? data.slug.trim()
    : data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
}));