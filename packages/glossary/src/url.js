export const glossaryBaseUrl = 'https://glossary.rjmlaird.co.uk/';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** True when `slug` is safe to use as a single URL path segment. */
export function isValidSlug(slug) {
  return typeof slug === 'string' && SLUG.test(slug);
}

/** Canonical definition URL for a slug: https://glossary.rjmlaird.co.uk/{slug}/ */
export function glossaryUrl(slug) {
  if (!isValidSlug(slug)) throw new Error(`Invalid glossary slug: ${JSON.stringify(slug)}`);
  return `${glossaryBaseUrl}${slug}/`;
}
