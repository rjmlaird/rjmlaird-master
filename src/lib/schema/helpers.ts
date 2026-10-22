import { ASSET_BASE, COUNTRY_CODES, SITE_URL } from './config';
import type { JsonLd, MaybeWrapped } from './types';

/** Stable, readable @id for a node: https://site/#kind-id */
export const nodeId = (kind: string, id: string | number): string =>
  `${SITE_URL}/#${kind}-${String(id)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;

/** Recursively drops undefined, null, empty strings, empty arrays and empty objects. */
export function compact<T>(value: T): T | undefined {
  if (Array.isArray(value)) {
    const arr = value.map((v) => compact(v)).filter((v) => v !== undefined);
    return (arr.length ? arr : undefined) as T | undefined;
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const c = compact(v);
      if (c !== undefined) out[k] = c;
    }
    return (Object.keys(out).length ? out : undefined) as T | undefined;
  }
  if (value === null || value === undefined || value === '') return undefined;
  return value;
}

/** Returns "YYYY", "YYYY-MM" or "YYYY-MM-DD" from loose input (including full ISO timestamps). */
export function isoDate(input?: string | null): string | undefined {
  if (!input) return undefined;
  const m = /^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/.exec(input.trim());
  if (!m) return undefined;
  return [m[1], m[2], m[3]].filter(Boolean).join('-');
}

/** True when the date lies after the build time — used to discard placeholder dates. */
export function isFuture(iso?: string): boolean {
  if (!iso) return false;
  const [y, mo = '01', d = '01'] = iso.split('-');
  return new Date(`${y}-${mo}-${d}T00:00:00Z`).getTime() > Date.now();
}

export function countryCode(name?: string): string | undefined {
  if (!name) return undefined;
  return COUNTRY_CODES[name.trim().toLowerCase()] ?? (name.length === 2 ? name.toUpperCase() : name);
}

export function cleanUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim().replace(/#$/, '');
  return /^https?:\/\//i.test(trimmed) ? trimmed : undefined;
}

export function absoluteUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  if (path.startsWith('/')) return `${ASSET_BASE}${path}`;
  return undefined;
}

export const uniq = <T>(arr: T[]): T[] => [...new Set(arr)];

export function unwrap<T, K extends string>(data: MaybeWrapped<T, K> | undefined, key: K): T[] {
  if (!data) return [];
  return Array.isArray(data) ? data : ((data as Record<K, T[]>)[key] ?? []);
}

export function titleCaseSlug(slug: string): string {
  return slug.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

/** YouTube ids in the data sometimes carry a stray "v=" prefix. */
export function youtubeId(raw?: string): string | undefined {
  if (!raw) return undefined;
  const id = raw.trim().replace(/^v=/, '');
  return /^[\w-]{11}$/.test(id) ? id : undefined;
}

/** Narrowing helper: drops undefined from an array. */
export const defined = <T>(arr: (T | undefined | null)[]): T[] => arr.filter((v): v is T => v != null);

export type Node = JsonLd;
