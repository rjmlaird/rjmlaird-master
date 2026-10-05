import { z } from "zod";

export const membershipTypeSchema = z.enum([
  "chartered_body",
  "professional_body",
  "scientific_body",
  "security_body",
  "industry_association",
  "climate_network",
  "research_network",
  "media_network",
  "creative_network",
  "space_network",
  "urban_network",
  "sustainability_network",
  "business_association",
  "startup_network",
  "community_network",
  "ethics_framework",
  "education_network",
  "framework_network",
  "economic_network",
  "advocacy_network",
  "climate_lab",
  "industry_initiative",
  "nonprofit_network",
  "ethics_network",
  "business_climate_network",
  "urban_innovation_network",
]);

export const membershipRoleSchema = z.union([
  z.enum([
    "Member",
    "Associate Member",
    "Certified Member",
    "Fellow",
    "Chartered Marketer (CMktr)",
    "Supporter",
  ]),
  z.string().trim(),
]);

export const membershipLinkSchema = z.object({
  website: z.url().optional(),
  profile: z.url().optional(),
});

export const membershipItemSchema = z.object({
  organisation: z.string().trim(),
  slug: z.string().trim(),
  organisationSlug: z.string().trim(),
  role: membershipRoleSchema,
  type: membershipTypeSchema,
  description: z.string().trim().optional(),
  keywords: z.array(z.string().trim()).default([]),
  links: membershipLinkSchema.optional(),
  activeFrom: z.string().trim().optional(),
  activeTo: z.string().trim().optional(),
  verified: z.boolean().optional(),
});

export const membershipGroupSchema = z.object({
  title: z.string().trim(),
  items: z.array(membershipItemSchema),
});

export const membershipSchema = z.object({
  memberships: z.array(membershipGroupSchema),
});

export type MembershipType = z.infer<typeof membershipTypeSchema>;
export type MembershipRole = z.infer<typeof membershipRoleSchema>;
export type MembershipItem = z.infer<typeof membershipItemSchema>;
export type MembershipGroup = z.infer<typeof membershipGroupSchema>;
export type MembershipSchema = z.infer<typeof membershipSchema>;
