import { z } from "zod";

export const toolItemSchema = z.object({
  name: z.string().trim(),
  url: z.url().optional(),
  logo: z.string().trim(),
  color: z.string().trim(),
  logoColor: z.string().trim().optional(),
});

export const toolCategorySchema = z.object({
  name: z.string().trim(),
  items: z.array(toolItemSchema),
});

export const techStackSchema = z.object({
  categories: z.array(toolCategorySchema),
});

export type ToolItem = z.infer<typeof toolItemSchema>;
export type ToolCategory = z.infer<typeof toolCategorySchema>;
export type TechStack = z.infer<typeof techStackSchema>;
