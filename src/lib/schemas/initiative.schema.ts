import { z } from "zod";

export const initiativeSchema = z.object({
  title: z.string().trim(),
  description: z.string().trim(),
  status: z.enum(["Active", "Planning", "Completed"]),
  organisation: z.string().trim(),
  website: z.url().optional(),
  impacts: z.array(z.string().trim()).default([]),
});

export type Initiative = z.infer<typeof initiativeSchema>;
