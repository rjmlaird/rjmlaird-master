import { z } from "zod";
import { baseSchema } from "./base.schema";

export const publicationSchema = baseSchema.extend({
  outlet: z.string().trim(),
  type: z.enum(["Article", "Podcast", "Interview", "Paper", "Press Release"]),
  author: z.string().trim(),
  published: z.string().trim(),
  url: z.url().optional(),
});

export type Publication = z.infer<typeof publicationSchema>;
