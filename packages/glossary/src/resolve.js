import { glossaryUrl, isValidSlug } from './url.js';

/**
 * Lookup key shared by names, slugs and aliases: case-insensitive, with hyphens,
 * underscores and runs of whitespace treated alike, so "Earth observation",
 * "earth-observation" and "EARTH  OBSERVATION" all match.
 */
export function normaliseKey(value) {
  return String(value)
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\s_-]+/g, ' ')
    .trim();
}

/**
 * Returns a list of problems with a term list (empty when valid). Checks required
 * fields, URL-safe slugs, canonical URLs, and duplicate slugs / names / aliases.
 */
export function validateTerms(terms) {
  const errors = [];
  if (!Array.isArray(terms)) return ['Glossary terms must be an array.'];
  const owners = new Map(); // key -> { slug, via }
  const slugs = new Set();

  for (const t of terms) {
    const label = t && t.slug ? t.slug : JSON.stringify(t);
    if (!t || typeof t.term !== 'string' || !t.term.trim()) {
      errors.push(`Term "${label}" has no name.`);
      continue;
    }
    if (!isValidSlug(t.slug)) {
      errors.push(`Term "${t.term}" has an invalid slug ${JSON.stringify(t.slug)}.`);
      continue;
    }
    if (slugs.has(t.slug)) errors.push(`Duplicate slug "${t.slug}".`);
    slugs.add(t.slug);
    if (t.url !== glossaryUrl(t.slug)) {
      errors.push(`Term "${t.slug}" has url ${JSON.stringify(t.url)}; expected ${glossaryUrl(t.slug)}.`);
    }

    const keys = [
      [t.term, 'name'],
      [t.slug, 'slug'],
      ...(t.aliases ?? []).map((a) => [a, 'alias']),
    ];
    const own = new Set();
    for (const [raw, via] of keys) {
      const key = normaliseKey(raw);
      if (!key) {
        errors.push(`Term "${t.slug}" has an empty ${via}.`);
        continue;
      }
      if (own.has(key)) continue; // a term repeating itself is harmless
      own.add(key);
      const prior = owners.get(key);
      if (prior && prior.slug !== t.slug) {
        errors.push(`"${raw}" (${via} of "${t.slug}") collides with the ${prior.via} of "${prior.slug}".`);
      } else {
        owners.set(key, { slug: t.slug, via });
      }
    }
  }
  return errors;
}

/** Builds a key -> term lookup. Throws if the term list is invalid. */
export function createIndex(terms) {
  const errors = validateTerms(terms);
  if (errors.length) throw new Error(`Invalid glossary manifest:\n- ${errors.join('\n- ')}`);
  const map = new Map();
  for (const t of terms) {
    for (const raw of [t.term, t.slug, ...(t.aliases ?? [])]) map.set(normaliseKey(raw), t);
  }
  return map;
}

const indexCache = new WeakMap();

/** Resolves a name, slug or alias to a term, or undefined. */
export function resolveGlossaryTerm(reference, terms) {
  let index = indexCache.get(terms);
  if (!index) {
    index = createIndex(terms);
    indexCache.set(terms, index);
  }
  return index.get(normaliseKey(reference));
}

/** Plain Levenshtein distance; inputs are short. */
export function editDistance(a, b) {
  if (a === b) return 0;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

/** Closest known term for a mistyped reference, or undefined. */
export function suggestTerm(reference, terms) {
  const key = normaliseKey(reference);
  const limit = Math.max(2, Math.floor(key.length / 4));
  let best;
  for (const t of terms) {
    for (const raw of [t.term, t.slug, ...(t.aliases ?? [])]) {
      const d = editDistance(key, normaliseKey(raw));
      if (d <= limit && (!best || d < best.d)) best = { d, term: t };
    }
  }
  return best?.term;
}
