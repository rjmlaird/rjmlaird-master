import { z } from "zod";

export const awardSchema = z.object({
  id: z.string(),
  title: z.string(),
  issuer: z.union([z.string(), z.array(z.string())]),
  year: z.number().optional(),
  type: z.string().optional(),
  event: z.string().optional(),
  session_title: z.string().optional(),
  project: z.string().optional(),
  category: z.string().optional(),
  client: z.string().optional(),
  value: z.string().optional(),
  programme: z.string().optional(),
  instrument: z.string().optional(),
  location: z.string().optional(),
  duration: z.string().optional(),
  summary: z.string().optional(),
  award: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  relatedExperience: z.array(z.string()).optional(),
  relatedEducation: z.array(z.string()).optional(),
  relatedVolunteering: z.array(z.string()).optional(),
});

export const awardsResponseSchema = z.object({
  awards: z.array(awardSchema),
});

export type Award = z.infer<typeof awardSchema>;
export type AwardsResponse = z.infer<typeof awardsResponseSchema>;