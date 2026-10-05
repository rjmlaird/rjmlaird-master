import { z } from "zod";

export const reviewerSchema = z.object({
  name: z.string().trim(),
  slug: z.string().trim().optional(),
  avatar: z.string().trim().optional(),
  position: z.string().trim().optional(),
  company: z.string().trim().optional(),
  companySlug: z.string().trim().optional(),
  linkedin: z.url().optional(),
  website: z.url().optional(),
});

export const reviewContextSchema = z.enum([
  "collaboration",
  "employment",
  "internship",
  "consulting",
  "speaking",
  "education",
  "general",
]);

export const reviewSentimentSchema = z.enum([
  "positive",
  "strong_positive",
  "neutral",
]);

export const reviewOrganisationSchema = z.object({
  name: z.string().trim(),
  slug: z.string().trim().optional(),
  industry: z.string().trim().optional(),
  url: z.url().optional(),
});

export const reviewSchema = z.object({
  id: z.string().trim().optional(),
  content: z.string().trim(),
  author: reviewerSchema,
  organisation: reviewOrganisationSchema.optional(),
  context: reviewContextSchema.optional(),
  position: z.string().trim().optional(),
  company: z.string().trim().optional(),
  avatar: z.string().trim().optional(),
  tags: z.array(z.string().trim()).default([]),
  sentiment: reviewSentimentSchema.optional(),
  verified: z.boolean().optional(),
  verified_by: z.string().trim().optional(),
  related_projects: z.array(z.string().trim()).default([]),
  related_experience: z.array(z.string().trim()).default([]),
  related_case_studies: z.array(z.string().trim()).default([]),
  date: z.string().trim().optional(),
  source: z.string().trim().optional(),
  featured: z.boolean().optional(),
});

export const reviewsSchema = z.object({
  reviews: z.array(reviewSchema),
});

export type Reviewer = z.infer<typeof reviewerSchema>;
export type ReviewContext = z.infer<typeof reviewContextSchema>;
export type ReviewSentiment = z.infer<typeof reviewSentimentSchema>;
export type Review = z.infer<typeof reviewSchema>;
export type ReviewsSchema = z.infer<typeof reviewsSchema>;
