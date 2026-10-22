import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import {
  glossaryBaseUrl, glossaryTerms, glossaryUrl, resolveGlossaryTerm, validateTerms,
  suggestTerm, remarkGlossaryLinks,
} from '../src/index.js';

const TERMS = [
  { term: 'Climate', slug: 'climate', aliases: ['climate system'], url: 'https://glossary.rjmlaird.co.uk/climate/' },
  { term: 'Climate change', slug: 'climate-change', url: 'https://glossary.rjmlaird.co.uk/climate-change/' },
  { term: 'Earth observation', slug: 'earth-observation', url: 'https://glossary.rjmlaird.co.uk/earth-observation/' },
  { term: 'Synthetic aperture radar', slug: 'synthetic-aperture-radar', aliases: ['SAR'], url: 'https://glossary.rjmlaird.co.uk/synthetic-aperture-radar/' },
];

async function render(md, options = {}, path = '/project/src/content/blog/example.md') {
  const processor = await createMarkdownProcessor({
    remarkPlugins: [[remarkGlossaryLinks, { terms: TERMS, ...options }]],
  });
  const { code } = await processor.render(md, { fileURL: new URL(`file://${path}`) });
  return code;
}
const href = (slug) => `href="https://glossary.rjmlaird.co.uk/${slug}/"`;

test('[climate] links to the canonical glossary URL', async () => {
  const html = await render('See [climate].');
  assert.match(html, new RegExp(`<a ${href('climate')} class="glossary-link">climate</a>`));
});
test('matching is case-insensitive and keeps the author\'s casing', async () => {
  assert.match(await render('[Climate]'), new RegExp(`${href('climate')}[^>]*>Climate</a>`));
});
test('resolves by slug and shows the term name for a hyphenated slug', async () => {
  assert.match(await render('[climate-change]'), new RegExp(`${href('climate-change')}[^>]*>Climate change</a>`));
});
test('pipe syntax sets visible text', async () => {
  const html = await render('[synthetic aperture radar|SAR]');
  assert.match(html, new RegExp(`${href('synthetic-aperture-radar')}[^>]*>SAR</a>`));
});
test('aliases resolve', async () => {
  assert.match(await render('[SAR]'), new RegExp(`${href('synthetic-aperture-radar')}[^>]*>SAR</a>`));
  assert.match(await render('[climate system]'), new RegExp(href('climate')));
});
test('unknown references throw in strict mode, with a suggestion and file path', async () => {
  await assert.rejects(render('[climte]', { strict: true }), (e) => {
    assert.match(e.message, /Unknown glossary reference "climte"/);
    assert.match(e.message, /src\/content\/blog\/example\.md|example\.md/);
    assert.match(e.message, /Did you mean "Climate"\?/);
    return true;
  });
});
test('unknown references are left unchanged (and warned) in non-strict mode', async () => {
  const warn = console.warn; const seen = [];
  console.warn = (m) => seen.push(m);
  try {
    const html = await render('A [climte] typo.', { strict: false });
    assert.match(html, /\[climte\]/);
    assert.doesNotMatch(html, /<a /);
    assert.equal(seen.length, 1);
  } finally { console.warn = warn; }
});
test('ordinary Markdown links are not modified', async () => {
  const html = await render('[ESA](https://www.esa.int/) and [climate](https://example.com/c)');
  assert.match(html, /<a href="https:\/\/www\.esa\.int\/">ESA<\/a>/);
  assert.match(html, /<a href="https:\/\/example\.com\/c">climate<\/a>/);
  assert.doesNotMatch(html, /glossary\.rjmlaird/);
});
test('inline code and fenced code are not modified', async () => {
  const html = await render('Inline `[climate]` here.\n\n```md\n[climate]\n```\n');
  assert.doesNotMatch(html, /glossary\.rjmlaird/);
  assert.match(html, /\[climate\]|\[<span[^>]*>climate/);
});
test('links containing brackets in their text are not corrupted', async () => {
  const html = await render('[see [climate] notes](https://example.com/x)');
  assert.match(html, /<a href="https:\/\/example\.com\/x">/);
  assert.doesNotMatch(html, /glossary\.rjmlaird/);
});
test('punctuation stays outside the link', async () => {
  const html = await render('([Climate]), [climate]. And [climate]!');
  assert.match(html, /\(<a [^>]*>Climate<\/a>\),/);
  assert.match(html, /<\/a>\./);
  assert.match(html, /<\/a>!/);
});
test('escaped brackets, footnotes, task lists and numeric markers are not references', async () => {
  const html = await render('Escaped \\[climate\\] and [1] and [...]\n\n- [x] done\n- [ ] todo\n\nNote[^1]\n\n[^1]: n');
  assert.doesNotMatch(html, /glossary\.rjmlaird/);
});
test('generated text is not transformed again', async () => {
  const html = await render('[climate|climate change]');
  assert.equal((html.match(/<a /g) ?? []).length, 1);
  assert.match(html, new RegExp(`${href('climate')}[^>]*>climate change</a>`));
});
test('visible text is HTML-escaped, never injected', async () => {
  const html = await render('[climate|1 < 2 & 3]');
  assert.match(html, /1 (&#x3C;|&lt;) 2 (&#x26;|&amp;) 3<\/a>/);
});
test('only absolute glossary URLs are produced, never local routes', async () => {
  const html = await render('[climate] [Earth observation] [SAR]');
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(hrefs.length, 3);
  for (const h of hrefs) assert.ok(h.startsWith(glossaryBaseUrl), h);
});

test('manifest validation: duplicate slugs, names and alias collisions', () => {
  const t = (o) => ({ url: glossaryUrl(o.slug), ...o });
  assert.match(validateTerms([t({ term: 'A', slug: 'a' }), t({ term: 'B', slug: 'a' })]).join(), /Duplicate slug "a"/);
  assert.match(validateTerms([t({ term: 'Same', slug: 'a' }), t({ term: 'same', slug: 'b' })]).join(), /collides/);
  assert.match(validateTerms([t({ term: 'A', slug: 'a', aliases: ['B'] }), t({ term: 'B', slug: 'b' })]).join(), /collides/);
  assert.match(validateTerms([{ term: 'A', slug: 'Bad Slug', url: 'x' }]).join(), /invalid slug/);
  assert.deepEqual(validateTerms(TERMS), []);
});
test('glossaryUrl rejects unsafe slugs and always uses the canonical host', () => {
  assert.equal(glossaryUrl('earth-observation'), 'https://glossary.rjmlaird.co.uk/earth-observation/');
  for (const bad of ['', '/x', 'x/', 'a//b', '../x', 'A', 'a b']) assert.throws(() => glossaryUrl(bad), bad);
});
test('suggestions use edit distance', () => {
  assert.equal(suggestTerm('climte', TERMS)?.slug, 'climate');
  assert.equal(suggestTerm('zzzzzz', TERMS), undefined);
});

test('the bundled manifest is valid and every URL is canonical', () => {
  assert.deepEqual(validateTerms(glossaryTerms), []);
  assert.ok(glossaryTerms.length > 0);
  for (const t of glossaryTerms) assert.equal(t.url, `https://glossary.rjmlaird.co.uk/${t.slug}/`);
  assert.equal(resolveGlossaryTerm('SNR')?.slug, 'signal-to-noise-ratio');
});
test('fixture document renders with the real manifest', async () => {
  const processor = await createMarkdownProcessor({ remarkPlugins: [[remarkGlossaryLinks, { strict: true }]] });
  const { code } = await processor.render(readFileSync(new URL('./fixtures/sample.md', import.meta.url), 'utf8'), {
    fileURL: new URL('./fixtures/sample.md', import.meta.url),
  });
  assert.match(code, /href="https:\/\/glossary\.rjmlaird\.co\.uk\/earth-observation\/"/);
  assert.match(code, /href="https:\/\/glossary\.rjmlaird\.co\.uk\/signal-to-noise-ratio\/"[^>]*>SNR</);
  assert.match(code, /href="https:\/\/www\.esa\.int\/"/);
  assert.doesNotMatch(code, /href="\/(albedo|earth-observation)/);
});
