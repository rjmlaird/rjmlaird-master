import { getCollection, render, type CollectionEntry } from 'astro:content';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { TOPICS, TOPIC_ORDER, type AudienceId, type TopicId } from './faq-meta';

export type FaqEntry = CollectionEntry<'faqs'>;

export interface FaqFilter {
  /** Page id, e.g. "speaking" or "/work/example-case-study/". */
  page?: string;
  topic?: TopicId | TopicId[];
  audience?: AudienceId | AudienceId[];
  tags?: string[];
  /** "any" (default) or "all" tags must match. */
  tagMode?: 'any' | 'all';
  /** Include drafts. Defaults to true in `astro dev`, always false in builds. */
  includeDrafts?: boolean;
}

const STALE_AFTER_DAYS = 365;
const DAY_MS = 86_400_000;

/* ------------------------------------------------------------------ */
/* Page ids                                                            */
/* ------------------------------------------------------------------ */

/** "/Speaking/" -> "speaking", "/" -> "home", "/work/x/?a=1#b" -> "work/x". */
export function normalisePageId(input: string): string {
  const clean = input.split(/[?#]/)[0].trim().toLowerCase().replace(/^\/+|\/+$/g, '');
  return clean === '' ? 'home' : clean;
}

/** Exact match, or "section/*" wildcard match. */
export function matchesPage(targets: string[], page: string): boolean {
  const id = normalisePageId(page);
  return targets.some((t) => {
    const target = normalisePageId(t);
    return target === id || (target.endsWith('/*') && id.startsWith(target.slice(0, -1)));
  });
}

/* ------------------------------------------------------------------ */
/* Loading, validation, selection                                      */
/* ------------------------------------------------------------------ */

let cache: Promise<FaqEntry[]> | undefined;

async function loadAll(): Promise<FaqEntry[]> {
  const run = async () => validate(await getCollection('faqs'));
  if (import.meta.env.DEV) return run(); // always fresh while editing
  return (cache ??= run());
}

function normaliseQuestion(q: string): string {
  return q.toLowerCase().replace(/[^a-z0-9 ]+/g, '').replace(/\s+/g, ' ').trim();
}

/** Build-time editorial checks. Throws on errors, warns on staleness/placeholders. */
function validate(entries: FaqEntry[]): FaqEntry[] {
  const errors: string[] = [];
  const warnings: string[] = [];
  const ids = new Set(entries.map((e) => e.id));
  const seenQuestions = new Map<string, string>();
  const live = entries.filter((e) => e.data.status !== 'archived');

  for (const e of entries) {
    const { data } = e;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(e.id)) {
      errors.push(`${e.id}: file name must be kebab-case`);
    }
    if (!e.id.startsWith(`${data.topic}-`)) {
      errors.push(`${e.id}: file name must start with its topic ("${data.topic}-…")`);
    }
    if (data.supersededBy && !ids.has(data.supersededBy)) {
      errors.push(`${e.id}: supersededBy "${data.supersededBy}" does not exist`);
    }
  }

  for (const e of live) {
    const key = normaliseQuestion(e.data.question);
    const clash = seenQuestions.get(key);
    if (clash) errors.push(`${e.id}: duplicate question (same as ${clash}). Reuse it via pageTargets instead.`);
    else seenQuestions.set(key, e.id);

    if (e.data.status !== 'published') continue;

    const ageDays = (Date.now() - e.data.lastReviewed.getTime()) / DAY_MS;
    if (ageDays > STALE_AFTER_DAYS) {
      warnings.push(`${e.id}: last reviewed ${Math.floor(ageDays)} days ago (review or archive)`);
    }
    const text = `${e.data.question} ${e.data.shortAnswer ?? ''} ${e.body ?? ''}`;
    if (text.includes('[[')) {
      const msg = `${e.id}: still contains a [[PLACEHOLDER]]`;
      (process.env.FAQ_STRICT ? errors : warnings).push(msg);
    }
  }

  if (warnings.length) console.warn(`\n[faq] warnings:\n  - ${warnings.join('\n  - ')}\n`);
  if (errors.length) throw new Error(`[faq] content errors:\n  - ${errors.join('\n  - ')}`);
  return entries;
}

function asArray<T>(v: T | T[] | undefined): T[] | undefined {
  return v === undefined ? undefined : Array.isArray(v) ? v : [v];
}

/** Lower priority number first; then alphabetical id for a stable order. */
function byPriority(a: FaqEntry, b: FaqEntry): number {
  return a.data.priority - b.data.priority || a.id.localeCompare(b.id);
}

/** The one place that decides what is visible. */
export async function getFaqs(filter: FaqFilter = {}): Promise<FaqEntry[]> {
  const includeDrafts = filter.includeDrafts ?? import.meta.env.DEV;
  const topics = asArray(filter.topic);
  const audiences = asArray(filter.audience);
  const tags = filter.tags ?? [];

  return (await loadAll())
    .filter((e) => {
      const { status, topic, audience, pageTargets, tags: entryTags } = e.data;
      if (status === 'archived') return false;
      if (status === 'draft' && !includeDrafts) return false;
      if (filter.page && !matchesPage(pageTargets, filter.page)) return false;
      if (topics && !topics.includes(topic)) return false;
      if (audiences && !audience.some((a) => audiences.includes(a))) return false;
      if (tags.length) {
        const hit = (t: string) => entryTags.includes(t);
        if (!(filter.tagMode === 'all' ? tags.every(hit) : tags.some(hit))) return false;
      }
      return true;
    })
    .sort(byPriority);
}

export function limitFaqs(entries: FaqEntry[], limit?: number): FaqEntry[] {
  return limit && limit > 0 ? entries.slice(0, limit) : entries;
}

export interface FaqGroup {
  topic: TopicId;
  label: string;
  href?: string;
  linkLabel?: string;
  entries: FaqEntry[];
}

/** Group by topic in the order defined in faq-meta.ts. Empty groups are dropped. */
export function groupByTopic(entries: FaqEntry[]): FaqGroup[] {
  return TOPIC_ORDER.map((topic) => ({
    topic,
    ...TOPICS[topic],
    entries: entries.filter((e) => e.data.topic === topic),
  })).filter((g) => g.entries.length > 0);
}

/* ------------------------------------------------------------------ */
/* Optional FAQPage JSON-LD                                            */
/* ------------------------------------------------------------------ */

/**
 * Entries that may emit schema on `page`: opted in, published, and this page is the
 * canonical one (schemaPage, or the only page target).
 */
export function schemaEligible(entries: FaqEntry[], page: string): FaqEntry[] {
  const id = normalisePageId(page);
  return entries.filter((e) => {
    const { schema, status, schemaPage, pageTargets } = e.data;
    if (!schema || status !== 'published') return false;
    const owner = normalisePageId(schemaPage ?? pageTargets[0] ?? '');
    return owner === id;
  });
}

/**
 * Builds FAQPage JSON-LD whose answer HTML is the exact HTML Astro renders for the
 * visible answer, so the two cannot drift. Returns null when nothing qualifies.
 */
export async function buildFaqJsonLd(entries: FaqEntry[], page: string): Promise<string | null> {
  const eligible = schemaEligible(entries, page);
  if (!eligible.length) return null;

  const container = await AstroContainer.create();
  const mainEntity = [];
  for (const entry of eligible) {
    const { Content } = await render(entry);
    const html = (await container.renderToString(Content)).trim();
    mainEntity.push({
      '@type': 'Question',
      name: entry.data.question,
      acceptedAnswer: { '@type': 'Answer', text: html },
    });
  }
  const json = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity });
  return json.replace(/</g, '\\u003c'); // safe inside <script>
}
