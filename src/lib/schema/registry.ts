/// <reference types="astro/client" />
import type { Organisation } from './types';

/**
 * Flattens and de-duplicates organisations.json.
 * Handles the nested array and the repeated slugs found in the current file
 * (first occurrence wins; missing fields are filled from later duplicates).
 */
export function normaliseOrganisations(input: unknown): Organisation[] {
  const flat = (Array.isArray(input) ? (input as unknown[]).flat(Infinity) : []) as Organisation[];
  const map = new Map<string, Organisation>();
  for (const o of flat) {
    if (!o || typeof o !== 'object' || !o.slug) continue;
    const prev = map.get(o.slug);
    if (!prev) {
      map.set(o.slug, { ...o });
      continue;
    }
    const merged = prev as unknown as Record<string, unknown>;
    for (const [k, v] of Object.entries(o)) {
      const cur = merged[k];
      if (cur === undefined || cur === null || cur === '') merged[k] = v;
      else if (Array.isArray(cur) && Array.isArray(v)) merged[k] = [...new Set([...cur, ...v])];
    }
  }
  return [...map.values()];
}

/**
 * Default registry: reads src/data/organisations.json if present.
 * Using import.meta.glob means a missing file yields an empty registry instead of a build error.
 * To use your API instead, pass `organisations` (from fetch) to any schema component.
 */
const modules = import.meta.glob<unknown>('/src/data/organisations.json', {
  eager: true,
  import: 'default',
});
export const defaultOrganisations: Organisation[] = normaliseOrganisations(Object.values(modules)[0]);
