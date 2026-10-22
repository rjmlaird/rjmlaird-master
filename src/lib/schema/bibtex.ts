import type { BibEntry } from './types';

function matchBrace(src: string, start: number): number {
  let depth = 1;
  let i = start;
  while (i < src.length && depth > 0) {
    const c = src[i];
    if (c === '\\') i++;
    else if (c === '{') depth++;
    else if (c === '}') depth--;
    i++;
  }
  return i; // index just after the closing brace
}

function parseFields(body: string): Record<string, string> {
  const fields: Record<string, string> = {};
  let i = 0;
  while (i < body.length) {
    while (i < body.length && /[\s,]/.test(body[i])) i++;
    const name = /^[\w-]+/.exec(body.slice(i))?.[0];
    if (!name) break;
    i += name.length;
    while (i < body.length && /[\s=]/.test(body[i])) i++;
    let value = '';
    if (body[i] === '{') {
      const end = matchBrace(body, i + 1);
      value = body.slice(i + 1, end - 1);
      i = end;
    } else if (body[i] === '"') {
      let j = i + 1;
      let depth = 0;
      while (j < body.length && !(body[j] === '"' && depth === 0)) {
        if (body[j] === '{') depth++;
        if (body[j] === '}') depth--;
        j++;
      }
      value = body.slice(i + 1, j);
      i = j + 1;
    } else {
      const bare = /^[^,\s}]+/.exec(body.slice(i))?.[0] ?? '';
      value = bare;
      i += bare.length || 1;
    }
    fields[name.toLowerCase()] = value;
  }
  return fields;
}

export function parseBibtex(src: string): BibEntry[] {
  const entries: BibEntry[] = [];
  let i = 0;
  for (;;) {
    const at = src.indexOf('@', i);
    if (at < 0) break;
    const m = /^@(\w+)\s*\{/.exec(src.slice(at));
    if (!m) {
      i = at + 1;
      continue;
    }
    const bodyStart = at + m[0].length;
    const end = matchBrace(src, bodyStart);
    i = end;
    const type = m[1].toLowerCase();
    if (['comment', 'string', 'preamble'].includes(type)) continue;
    const body = src.slice(bodyStart, end - 1);
    const comma = body.indexOf(',');
    if (comma < 0) continue;
    entries.push({ type, key: body.slice(0, comma).trim(), fields: parseFields(body.slice(comma + 1)) });
  }
  return entries;
}

const ACCENTS: Record<string, string> = { '`': '\u0300', "'": '\u0301', '^': '\u0302', '~': '\u0303', '=': '\u0304', '.': '\u0307', '"': '\u0308' };

/** Light LaTeX → plain text clean-up for BibTeX values. */
export function cleanTex(s: string | undefined): string {
  if (!s) return '';
  return s
    .replace(/\\(["'`^~=.])\{?([A-Za-z])\}?/g, (_, a: string, l: string) => (l + ACCENTS[a]).normalize('NFC'))
    .replace(/\\ss\b/g, 'ß')
    .replace(/\\([&%_$#])/g, '$1')
    .replace(/[{}]/g, '')
    .replace(/~/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Splits an author field on top-level " and ". */
export function splitAuthors(raw: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  const parts = raw.split(/(\s+and\s+)/);
  for (const p of parts) {
    if (/^\s+and\s+$/.test(p) && depth === 0) {
      out.push(cur);
      cur = '';
      continue;
    }
    for (const c of p) {
      if (c === '{') depth++;
      if (c === '}') depth--;
    }
    cur += p;
  }
  if (cur.trim()) out.push(cur);
  return out.map((a) => a.trim()).filter(Boolean);
}

export interface ParsedName {
  full: string;
  given?: string;
  family?: string;
  corporate: boolean;
}

export function parseName(raw: string): ParsedName {
  const t = raw.trim();
  if (/^\{.*\}$/.test(t)) return { full: cleanTex(t), corporate: true };
  if (t.includes(',')) {
    const [family, given] = t.split(',').map((x) => cleanTex(x));
    return { full: `${given} ${family}`.trim(), given, family, corporate: false };
  }
  const words = cleanTex(t).split(' ');
  const family = words.pop();
  return { full: cleanTex(t), given: words.join(' ') || undefined, family, corporate: false };
}
