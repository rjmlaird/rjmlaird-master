import { z } from "zod";
import { socialSchema } from "./base.schema";

export const profileSchema = z.object({
  name: z.string().trim(),
  preferredName: z.string().trim().optional(),
  pronouns: z.string().trim().optional(),
  headline: z.string().trim(),
  biography: z.string().trim(),
  location: z.string().trim(),
  email: z.email().optional(),
  website: z.url().optional(),
  avatar: z.string().trim(),
  credentials: z.array(z.string().trim()).default([]),
  interests: z.array(z.string().trim()).default([]),
  socials: z.array(socialSchema).default([]),
});

export type Profile = z.infer<typeof profileSchema>;
