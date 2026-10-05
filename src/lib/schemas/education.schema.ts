import { z } from "zod";

export const educationItemSchema = z.object({
  id: z.string(),
  institution: z.string(),
  role: z.string(),
  qualification: z.string(),
  field: z.string().optional(),
  institutionType: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  city: z.string(),
  country: z.string(),
  summary: z.string(),
  keyActivities: z.array(z.string()).optional(),
  achievements: z.array(z.string()).optional(),
  skills: z.array(z.string()).optional(),
  domainExpertise: z.array(z.string()).optional(),
  technicalSkills: z.array(z.string()).optional(),
  practices: z.array(z.string()).optional(),
  leadershipAndCollaboration: z.array(z.string()),
  areasOfInterest: z.array(z.string()),
  projects: z.array(z.string()),
  clients: z.array(z.string()),
  articles: z.array(z.unknown()).optional(),
  talks: z.array(z.unknown()),
  relatedAwards: z.array(z.string()).optional().default([]),
  relatedCertifications: z.array(z.string()).optional().default([]),
  technologies: z.array(z.unknown()),
  media: z.array(z.unknown()),
  featured: z.boolean(),
  order: z.number(),
});

export const educationSchema = educationItemSchema;

export type EducationItem = z.infer<typeof educationItemSchema>;
