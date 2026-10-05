import { z } from "zod";

export const organisationTypeSchema = z.enum([
  "partner",
  "client",
  "employer",
  "publisher",
  "community",
  "institution",
  "other",
]);

export const organisationIndustrySchema = z.enum([
  "space",
  "marketing",
  "climate",
  "technology",
  "education",
  "research",
  "other",
]);

const websiteSchema = z.preprocess(
  (value) => {
    if (value == null) return undefined;
    if (typeof value !== "string") return value;

    const trimmed = value.trim();
    if (!trimmed) return undefined;

    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  },
  z.url().optional(),
);

export const organisationSchema = z.object({
  organisation: z.string().trim(),
  slug: z.string().trim(),
  description: z.string().trim().optional(),
  website: websiteSchema,
  hubspotId: z.string().trim().optional(),
  industry: organisationIndustrySchema.optional(),
  category: z.string().trim().optional(),
  type: organisationTypeSchema.optional(),
  logo: z.string().trim().optional(),
  featured: z.boolean().optional(),
});

export type OrganisationType = z.infer<typeof organisationTypeSchema>;
export type OrganisationIndustry = z.infer<typeof organisationIndustrySchema>;
export type Organisation = z.infer<typeof organisationSchema>;
