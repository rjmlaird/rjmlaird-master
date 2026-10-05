import { z } from "zod";

export const languageSchema = z.object({
  name: z.string().trim(),
  level: z.string().trim(),
  proficiency: z.number().int().min(0).max(100),
});

export type Language = z.infer<typeof languageSchema>;
