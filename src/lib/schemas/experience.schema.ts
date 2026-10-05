import { z } from "astro/zod";

export const experienceModeSchema = z.enum([
  "agency",
  "company",
  "freelance",
  "programme",
  "non_profit",
  "network",
  "research",
  "university",
  "education",
  "government",
  "local_authority",
  "media",
  "consortium",
  "school",
  "internship",
  "outreach",
  "independent",
]);

export const employmentTypeSchema = z.enum([
  "founder",
  "employee",
  "contract",
  "freelance",
  "internship",
  "research",
  "academic",
  "career_break",
]);

export const workModeSchema = z.enum(["remote", "hybrid", "onsite"]);

const urlField = () =>
  z.preprocess(
    (value) => {
      if (value == null) return undefined;
      if (typeof value !== "string") return value;

      const trimmed = value.trim();
      if (!trimmed) return undefined;

      return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    },
    z.url().optional(),
  );

export const experienceLinkSchema = z.object({
  label: z.string().trim(),
  url: urlField(),
});

export const organisationSchema = z.object({
  id: z.string().trim(),
  name: z.string().trim(),
  slug: z.string().trim(),
  type: experienceModeSchema.optional(),
  website: urlField().optional(),
});

export const organisationValueSchema = z.union([
  z.string().trim(),
  organisationSchema,
]);

export const experienceImpactSchema = z.object({
  metric: z.string().trim(),
  value: z.union([z.string(), z.number()]),
  context: z.string().trim().optional(),
});

export const experienceMediaSchema = z.object({
  type: z.enum(["image", "video", "article"]),
  url: urlField(),
  caption: z.string().trim().optional(),
});

export const experienceItemSchema = z.object({
  id: z.string(),
  organisation: organisationValueSchema,
  department: z.string().optional(),
  role: z.string(),
  employmentType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().nullable().optional(),
  current: z.boolean().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  workMode: z.string().optional(),
  summary: z.string().optional(),
  responsibilities: z.array(z.string()).default([]),
  achievements: z.array(z.string()).default([]),
  projects: z.array(z.string()).default([]),
  skills: z.array(z.string()).default([]),
  featured: z.boolean().optional(),
  order: z.number().optional(),
  relatedAwards: z.array(z.string()).optional().default([]),
  relatedCertifications: z.array(z.string()).optional().default([]),
});

export const experienceResponseSchema = z.object({
  data: z.array(experienceItemSchema),
  meta: z
    .object({
      total: z.number().int(),
      generatedAt: z.string().trim(),
      version: z.string().trim(),
    })
    .optional(),
});

export type ExperienceMode = z.infer<typeof experienceModeSchema>;
export type EmploymentType = z.infer<typeof employmentTypeSchema>;
export type WorkMode = z.infer<typeof workModeSchema>;
export type ExperienceLink = z.infer<typeof experienceLinkSchema>;
export type Organisation = z.infer<typeof organisationSchema>;
export type ExperienceImpact = z.infer<typeof experienceImpactSchema>;
export type ExperienceMedia = z.infer<typeof experienceMediaSchema>;
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type ExperienceResponse = z.infer<typeof experienceResponseSchema>;
