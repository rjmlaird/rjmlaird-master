import { z } from "zod";

export const certificationSchema = z.object({
  name: z.string().trim(),
  issuer: z.string().trim(),
  issuedDate: z.string().trim(),
  expiryDate: z.string().trim().optional(),
  credentialId: z.string().trim().optional(),
  url: z.url().optional(),
  skills: z.array(z.string().trim()).default([]),
});

export type Certification = z.infer<typeof certificationSchema>;
