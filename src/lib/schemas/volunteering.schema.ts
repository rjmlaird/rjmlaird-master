import { z } from "zod";

export const volunteeringItemSchema = z.object({
  id: z.string(),
  organisation: z.string(),
  role: z.string(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean(),
  city: z.string(),
  country: z.string(),
  summary: z.string(),
  responsibilities: z.array(z.string()),
  achievements: z.array(z.string()),
  skills: z.array(z.string()),
  projects: z.array(z.string()),
  articles: z.array(z.unknown()).optional(),
  talks: z.array(z.unknown()),
  featured: z.boolean(),
  order: z.number(),
  relatedAwards: z.array(z.string()).optional().default([]),
  relatedCertifications: z.array(z.string()).optional().default([]),
});

export const volunteeringSchema = volunteeringItemSchema;

export type VolunteeringItem = z.infer<typeof volunteeringItemSchema>;
