import { z } from "zod";

export const DEFAULT_FEATURED_IMAGE = "/images/default-featured.jpg";

export const seoSchema = z.object({
  title: z.string().trim().default(""),
  description: z.string().trim().default(""),
  image: z.string().trim().default(DEFAULT_FEATURED_IMAGE),
});

export const linkSchema = z.object({
  label: z.string().trim(),
  url: z.url().optional(),
});

export const socialSchema = z.object({
  platform: z.string().trim(),
  username: z.string().trim().optional(),
  url: z.url().optional(),
  icon: z.string().trim().optional(),
});

export const imageSchema = z.object({
  src: z.string().trim(),
  alt: z.string().trim().default(""),
});

export const baseSchema = z.object({
  id: z.string().trim(),
  slug: z.string().trim(),
  title: z.string().trim(),
  summary: z.string().trim().default(""),
  description: z.string().trim().default(""),
  featured: z.boolean().default(false),
  featuredImage: z.string().trim().default(DEFAULT_FEATURED_IMAGE),
  tags: z.array(z.string().trim()).default([]),
  seo: seoSchema.default({
    title: "",
    description: "",
    image: DEFAULT_FEATURED_IMAGE,
  }),
  created: z.string().trim().optional(),
  updated: z.string().trim().optional(),
});

export type Base = z.infer<typeof baseSchema>;
