import data from '../data/tokens.resolved.json';

export interface ResolvedToken {
  name: string;
  cssVar: string;
  type: string;
  layer: 'primitive' | 'semantic' | 'component';
  value: string | number | string[];
  dark?: string | number | string[];
  alias?: string;
}

export const allTokens = data.tokens as ResolvedToken[];

export function tokensByPrefix(prefix: string, layer?: ResolvedToken['layer']) {
  return allTokens.filter((t) => t.name.startsWith(prefix) && (!layer || t.layer === layer));
}

export const display = (v: unknown) => (Array.isArray(v) ? v.join(', ') : String(v));
