import { z } from "zod";
import { baseSchema } from "./base.schema";

export const articleSchema = baseSchema.extend({
  source: z.string().trim().optional(),
  author: z.string().trim().optional(),
  publishedAt: z.string().trim().optional(),
  url: z.url().optional(),
  readingTime: z.number().int().positive().optional(),
  topics: z.array(z.string().trim()).default([]),
});

export type Article = z.infer<typeof articleSchema>;
