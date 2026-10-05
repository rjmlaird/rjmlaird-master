import { z } from "zod";

export const contactSchema = z.object({
  email: z.email().optional(),
  phone: z.string().trim().optional(),
  location: z.string().trim().optional(),
  timezone: z.string().trim().optional(),
  preferredContactMethod: z.enum(["email", "phone", "linkedin"]).optional(),
  availability: z.string().trim().optional(),
});

export type Contact = z.infer<typeof contactSchema>;
