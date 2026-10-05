import { z } from "zod";

export const serviceSchema = z.object({
  name: z.string().trim(),
  description: z.string().trim(),
  category: z.string().trim(),
  deliverables: z.array(z.string().trim()).default([]),
  pricingModel: z.enum(["fixed", "retainer", "hourly", "project-based"]).optional(),
  featured: z.boolean().default(false),
});

export type Service = z.infer<typeof serviceSchema>;
