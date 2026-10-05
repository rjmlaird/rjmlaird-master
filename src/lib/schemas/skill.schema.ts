import { z } from "zod";

export const skillSchema = z.object({
  name: z.string().trim(),
  category: z.string().trim(),
  proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"]),
  years: z.number().int().nonnegative().optional(),
  featured: z.boolean().default(false),
});

export const skillItemSchema = skillSchema;

export type Skill = z.infer<typeof skillSchema>;
export type SkillItem = z.infer<typeof skillItemSchema>;
