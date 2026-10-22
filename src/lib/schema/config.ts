/**
 * Central configuration for the schema layer.
 * Everything site-specific lives here so the mappers stay data-driven.
 */

export const SITE_URL = 'https://rjmlaird.co.uk';

/** Base used to absolutise relative paths such as "/logos/x.png" or "/images/y.png". */
export const ASSET_BASE = SITE_URL;

/**
 * Optional. If your credential PDFs/images live on a CDN, set the base here and
 * each credential gets a `url` of `${CDN_BASE}/${cdnId}`. Leave undefined to omit.
 */
export const CDN_BASE: string | undefined = undefined;

export const PERSON_ID = `${SITE_URL}/#person`;

export const PERSON = {
  name: 'Ryan Laird',
  givenName: 'Ryan',
  familyName: 'Laird',
  alternateName: ['RJMLaird'],
  jobTitle: 'Founder & Director',
  description: 'Astrophysicist, science communicator and digital strategist.',
  url: SITE_URL,
  locality: 'Leicester',
  country: 'GB',
  /** Slug in organisations.json for the organisation you run. */
  worksForSlug: 'impact-orbit-co',
};

/** Used to recognise you among BibTeX authors ("Laird, Ryan J M"). Lower-case. */
export const AUTHOR_MATCH = { family: 'laird', givenInitial: 'r' };

/** Credential `type` values left out of `hasCredential` (evidence documents, not credentials). */
export const EXCLUDED_CREDENTIAL_TYPES = new Set(['Transcript']);

/**
 * Social categories that may appear in `sameAs`. Messaging and lifestyle accounts are
 * deliberately excluded: sameAs should identify you, and some messaging URLs embed phone numbers.
 */
export const SAME_AS_CATEGORIES = new Set([
  'dev',
  'professional',
  'research',
  'writing',
  'social',
  'video',
  'speaking',
  'website',
  'business',
  'creative',
  'photography',
]);

/** URL patterns that must never reach JSON-LD, whatever the category. */
export const SAME_AS_DENY = /(wa\.me|api\.whatsapp|signal\.me|t\.me|^tel:|^mailto:)/i;

/** Maps `deliveryEntity` text in services.json to an organisation slug. Keys lower-case, no trailing dot. */
export const DELIVERY_ENTITIES: Record<string, string> = {
  'impact orbit co': 'impact-orbit-co',
  'green orbit digital': 'green-orbit-digital',
};

/** Tags that carry no meaning for search engines. */
export const IGNORED_TAGS = new Set(['portfolio', 'web', 'example']);

/** Only talks with these statuses are published as structured data. */
export const TALK_PUBLISH_STATUSES = new Set(['ready', 'delivered', 'scheduled']);

export const LANGUAGE_CODES: Record<string, string> = {
  english: 'en',
  french: 'fr',
  spanish: 'es',
  german: 'de',
  italian: 'it',
  portuguese: 'pt',
  dutch: 'nl',
};

export const COUNTRY_CODES: Record<string, string> = {
  'united kingdom': 'GB',
  uk: 'GB',
  england: 'GB',
  austria: 'AT',
  france: 'FR',
  germany: 'DE',
  italy: 'IT',
  spain: 'ES',
  'united states': 'US',
  usa: 'US',
  chile: 'CL',
  netherlands: 'NL',
};
