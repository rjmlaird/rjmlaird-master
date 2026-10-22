export type JsonLd = { [key: string]: unknown };

/** Accepts either a bare array or the `{ certifications: [...] }` wrapper used by some of your files. */
export type MaybeWrapped<T, K extends string> = T[] | { [P in K]: T[] };

export interface Organisation {
  slug: string;
  name: string;
  shortName?: string;
  aliases?: string[];
  legacySlugs?: string[];
  kind: string;
  sectors?: string[];
  relationships?: string[];
  description?: string;
  shortDescription?: string;
  url?: string | null;
  logo?: string | null;
  featured?: boolean;
  hubspotId?: string | number | null;
}

export interface CredentialItem {
  id: string;
  name: string;
  cdnId?: string;
  organisationSlug: string;
  type: string;
}
export type CertificationItem = CredentialItem;

export interface AwardItem {
  id: string;
  title: string;
  organisationSlug: string;
  additionalOrganisationSlugs?: string[];
  clientOrganisationSlug?: string;
  year?: number;
  type: string;
  event?: string;
  session_title?: string;
  summary?: string;
  programme?: string;
  project?: string;
  category?: string;
  award?: string;
  instrument?: string;
  location?: string;
  duration?: string;
  value?: string;
  keywords?: string[];
}

export interface EducationItem {
  id: string;
  organisationSlug: string;
  awardingBodySlug?: string;
  role: string;
  qualification?: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  city?: string;
  country?: string;
  summary?: string;
}

export interface VolunteeringItem {
  id: string;
  organisationSlug: string;
  role: string;
  event?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  city?: string;
  country?: string;
  summary?: string;
}

export interface MembershipGroup {
  title: string;
  items: { organisationSlug: string; role?: string }[];
}
export interface MembershipsFile {
  memberships: MembershipGroup[];
}

export interface SkillsTaxonomy {
  taxonomy?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface LanguageItem {
  name: string;
  level?: string;
  proficiency?: number;
}

export interface ServiceItem {
  id: string | number;
  title: string;
  summary?: string;
  list?: string[];
  targetAudience?: string[];
  deliveryEntity?: string;
}

export interface SocialItem {
  key: string;
  name?: string;
  url: string;
  status?: string;
  category?: string;
  type?: string | null;
}

export interface CaseStudyItem {
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  startDate?: string;
  status?: string;
  draft?: boolean;
  tags?: string[];
  links?: Record<string, string | undefined>;
  heroImage?: string;
  image?: string;
  clientOrganisationSlug?: string;
  sectors?: string[];
}

export interface VideoItem {
  slug: string;
  youtubeId?: string;
  title: string;
  url?: string;
  publishedDate?: string;
  client?: string;
  summary?: string;
  description?: string;
  production_credit?: string;
  heroImage?: string;
  video_type?: string;
  tags?: string[];
  relatedCaseStudies?: string[];
}

export interface TalkItem {
  id: string;
  series?: string;
  title: string;
  type?: string;
  level?: string;
  tags?: string[];
  summary?: string;
  key_points?: string[];
  audience?: string[];
  duration_minutes?: number;
  format?: string;
  status?: string;
  date?: string | null;
  location?: string;
  assets?: { slides?: string; video?: string; repo?: string };
}
export interface TalksFile {
  talk_series: TalkItem[];
}

export interface BibEntry {
  type: string;
  key: string;
  fields: Record<string, string>;
}
