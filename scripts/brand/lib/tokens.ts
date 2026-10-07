import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type Layer = 'primitive' | 'semantic' | 'component';
export type Theme = 'light' | 'dark';
export interface Token {
  name: string;
  path: string[];
  type: string;
  raw: unknown;
  layer: Layer;
}

const here = path.dirname(fileURLToPath(import.meta.url));
export const pkgDir = path.resolve(here, '..', '..', '..', 'src', 'brand');
export const srcDir = path.join(pkgDir, 'tokens-source');
export const distDir = path.join(pkgDir, 'generated');

export const readJson = (file: string) => JSON.parse(fs.readFileSync(path.join(srcDir, file), 'utf8'));

const isLeaf = (o: any) => o && typeof o === 'object' && '$value' in o;
export const isAlias = (v: unknown): v is string => typeof v === 'string' && /^\{[^}]+\}$/.test(v);
export const aliasTarget = (v: string) => v.slice(1, -1);

export function flatten(tree: any, layer: Layer, errors: string[], prefix: string[] = []): Token[] {
  const out: Token[] = [];
  for (const [key, val] of Object.entries(tree)) {
    if (key.startsWith('$')) continue;
    const p = [...prefix, key];
    if (isLeaf(val)) {
      const leaf = val as any;
      if (!leaf.$type) errors.push(`${p.join('.')}: missing $type`);
      out.push({ name: p.join('.'), path: p, type: leaf.$type, raw: leaf.$value, layer });
    } else if (val && typeof val === 'object') {
      out.push(...flatten(val, layer, errors, p));
    } else {
      errors.push(`${p.join('.')}: expected a token or group`);
    }
  }
  return out;
}

export function loadAll(errors: string[] = []) {
  const base = [
    ...flatten(readJson('primitives.json'), 'primitive', errors),
    ...flatten(readJson('semantic.json'), 'semantic', errors),
    ...flatten(readJson('components.json'), 'component', errors),
  ];
  const themes = readJson('themes.json');
  const dark = flatten(themes.dark ?? {}, 'semantic', errors);
  return { base, dark };
}

export const cssVar = (name: string) => '--' + name.replace(/\./g, '-');

export function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map((v) => (/\s/.test(String(v)) ? `"${v}"` : String(v))).join(', ');
  }
  return String(value);
}

export function makeResolver(base: Token[], dark: Token[]) {
  const light = new Map(base.map((t) => [t.name, t]));
  const darkMap = new Map([...light, ...dark.map((t) => [t.name, t] as const)]);
  const lookup = (theme: Theme) => (theme === 'dark' ? darkMap : light);
  function resolve(name: string, theme: Theme, seen: string[] = []): unknown {
    const t = lookup(theme).get(name);
    if (!t) throw new Error(`Unknown token: ${name}`);
    if (seen.includes(name)) throw new Error(`Alias cycle: ${[...seen, name].join(' -> ')}`);
    return isAlias(t.raw) ? resolve(aliasTarget(t.raw), theme, [...seen, name]) : t.raw;
  }
  return { light, darkMap, resolve };
}

export function toDtcg(tokens: Token[]) {
  const root: any = {};
  for (const t of tokens) {
    let o = root;
    t.path.forEach((k, i) => {
      o = o[k] = o[k] ?? {};
      if (i === t.path.length - 1) {
        o.$type = t.type;
        o.$value = t.raw;
      }
    });
  }
  return root;
}
