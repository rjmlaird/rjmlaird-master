#!/usr/bin/env node
// Regenerates packages/glossary/data/terms.json from the canonical glossary.
//
//   node scripts/sync-glossary.mjs --from ../rjmlaird-glossary/src/content/terms
//   node scripts/sync-glossary.mjs --url https://glossary.rjmlaird.co.uk/terms.json
//   node scripts/sync-glossary.mjs --from <dir> --check     # exit 1 if the manifest is stale
//
// The manifest is deterministic (sorted by slug, stable key order) and validated: duplicate
// slugs, duplicate names and alias collisions fail the run.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { glossaryUrl } from '../packages/glossary/src/url.js';
import { validateTerms } from '../packages/glossary/src/resolve.js';

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i === -1 ? undefined : args[i + 1] ?? true;
};
const check = args.includes('--check');
const out = path.resolve('packages/glossary/data/terms.json');

async function fromDirectory(dir) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md')).sort();
  if (!files.length) throw new Error(`No .md term files in ${dir}`);
  return files.map((f) => {
    const slug = f.replace(/\.md$/, '');
    const { data } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
    return { term: data.term, slug, short: data.short, aliases: data.aliases ?? [], category: data.category, url: glossaryUrl(slug) };
  });
}

async function fromUrl(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET ${url} -> ${res.status}`);
  const list = await res.json();
  if (list.some((t) => !('aliases' in t))) {
    throw new Error(`${url} has no "aliases" field. Deploy the glossary's updated terms.json first, or use --from.`);
  }
  return list.map((t) => ({ term: t.term, slug: t.slug, short: t.short, aliases: t.aliases ?? [], category: t.category, url: glossaryUrl(t.slug) }));
}

const dir = flag('--from') ?? process.env.GLOSSARY_TERMS_DIR;
const url = flag('--url');
let terms;
try {
  terms = url && url !== true ? await fromUrl(url) : await fromDirectory(path.resolve(dir && dir !== true ? dir : '../rjmlaird-glossary/src/content/terms'));
} catch (e) {
  console.error(`[glossary] ${e.message}`);
  process.exit(1);
}

terms = terms
  .map(({ term, slug, short, aliases, category, url }) => ({ term, slug, short, aliases: [...aliases].sort((a, b) => a.localeCompare(b, 'en')), category, url }))
  .sort((a, b) => a.slug.localeCompare(b.slug, 'en'));

const errors = validateTerms(terms);
if (errors.length) {
  console.error(`[glossary] Invalid glossary:\n- ${errors.join('\n- ')}`);
  process.exit(1);
}

const json = JSON.stringify(terms, null, 2) + '\n';
if (check) {
  const current = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : '';
  if (current !== json) {
    console.error('[glossary] packages/glossary/data/terms.json is out of date. Run: pnpm glossary:sync');
    process.exit(1);
  }
  console.log(`[glossary] manifest up to date (${terms.length} terms).`);
} else {
  fs.writeFileSync(out, json);
  console.log(`[glossary] wrote ${terms.length} terms to ${path.relative(process.cwd(), out)}`);
}
