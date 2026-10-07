import { z } from 'astro/zod';

export const sections = ['foundations', 'identity', 'voice', 'components', 'tokens', 'assets', 'sites', 'governance'] as const;
export type Section = (typeof sections)[number];

export const siteIds = ['main', 'astro', 'space', 'portfolio', 'research', 'tutoring', 'booking', 'images', 'labs'] as const;

export const docSchema = z.object({
  title: z.string(),
  description: z.string(),
  order: z.number().default(100),
  status: z.enum(['draft', 'review', 'stable']).default('draft'),
  lastReviewed: z.coerce.date().optional(),
  relatedPages: z.array(z.string()).default([]), // e.g. "identity/colour"
});

export const assetSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, 'lowercase letters, numbers and hyphens only'),
  title: z.string(),
  type: z.enum(['portrait', 'photography', 'project-image', 'illustration', 'icon', 'social-card', 'logo']),
  creator: z.string(),
  copyrightOwner: z.string(),
  licence: z.enum(['all-rights-reserved', 'cc-by-4.0', 'cc-by-nc-4.0', 'cc0']),
  usage: z.object({
    approved: z.array(z.string()).min(1),
    prohibited: z.array(z.string()).default([]),
  }),
  altText: z.string().min(1),
  captionGuidance: z.string().optional(),
  cdnUrl: z.string().url(),
  masterRef: z.string().optional(), // DAM record id
  lastReviewed: z.coerce.date(),
  relatedSites: z.array(z.enum(siteIds)).default([]),
});
export type Asset = z.infer<typeof assetSchema>;

export const siteProfileSchema = z.object({
  id: z.enum(siteIds),
  order: z.number(),
  name: z.string(),
  host: z.string(),
  purpose: z.string(),
  audience: z.string(),
  voice: z.string(),
  visual: z.string(),
  actions: z.array(z.string()).min(1),
  allowedContent: z.array(z.string()).default([]),
  restrictedContent: z.array(z.string()).default([]),
  relatedSites: z.array(z.enum(siteIds)).default([]),
});
export type SiteProfile = z.infer<typeof siteProfileSchema>;
