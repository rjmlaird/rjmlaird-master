# FAQ architecture for rjmlaird.co.uk

One source of truth for FAQs (Astro content collection, Markdown files in Git), shown contextually on service and case-study pages, with a small `/faq/` page for cross-cutting logistics.

**Assumptions:** Astro 5+ (built and type-checked on 7.4, Zod 4 via `astro/zod`), static output, `trailingSlash: 'always'`, plain scoped CSS with fallbacks to your tokens (`--color-link`, `--color-focus`), and a layout you already have (the included `BaseLayout.astro` is a stub to delete). Page ids are URL paths without slashes (`speaking`, `work/example-case-study`). Edit topics, labels and service URLs in `src/lib/faq-meta.ts`.

## 1. Recommendation

| | Content collection (Markdown) | TS/JSON data file | CMS-backed |
|---|---|---|---|
| Authoring | One file per FAQ; real Markdown | One growing file; answers as strings | Best editing UI |
| Validation | Zod schema, build fails on bad entries | Hand-rolled | Depends on CMS |
| Diffs/review | Clean per-FAQ diffs | Noisy | Outside Git |
| Retire/migrate | Change `status` or delete one file | Edit the big file | CMS workflow |
| Dependencies | None | None | Service + API keys + build hooks |
| Future CMS | Easy: Decap/Tina edit the same files | Rewrite needed | Already there |

**Use content collections.** Low-maintenance, Git-based, static, and a Git-backed CMS (Decap, Tina) can later edit the same Markdown files with no migration. A single data file is exactly the monolith you wanted to avoid. A hosted CMS is overkill for one maintainer.

## 2. Directory tree

```
src/
  content.config.ts            # collection + Zod schema
  content/faqs/                # one file per FAQ: <topic>-<slug>.md
  lib/
    faq-meta.ts                # topics, audiences, service URLs (edit here)
    faqs.ts                    # getFaqs(), grouping, validation, JSON-LD
  components/faqs/
    Faq.astro  FaqList.astro  FaqSection.astro  FaqPage.astro  FaqSearch.astro
  pages/
    speaking/index.astro  work/example-case-study/index.astro  faq/index.astro
  layouts/BaseLayout.astro     # stub, replace with yours
```

**File names:** kebab-case, prefixed with the topic (`speaking-topics.md`). The file name is the stable `id`: never rename a published file (links like `/faq/#speaking-topics` depend on it). The build fails if the prefix doesn't match `topic`.

## 3. Content schema

| Field | Req. | Rules and purpose |
|---|---|---|
| `id` | auto | The file name. Kebab-case, starts with the topic. |
| `question` | yes | 10–140 chars, ends with `?`. Phrase as the reader would. |
| body (answer) | yes | Markdown below the front matter. Aim for 40–120 words. |
| `shortAnswer` | no | 20–240 chars. For cards, snippets, summaries. |
| `audience` | yes | Array of `client`, `school`, `researcher`, `publisher`, `general`. For filtering. |
| `topic` | yes | One of `speaking`, `coaching`, `communication`, `writing`, `research`, `projects`, `contact`, `general`. Drives grouping. |
| `tags` | no | Kebab-case free tags for finer filtering. |
| `pageTargets` | yes if published | Page ids; `work/*` matches a whole section; `home` is `/`. |
| `priority` | no | 1–100, default 50. **Lower shows first.** |
| `status` | yes | `draft` (dev only), `published`, `archived` (never built). |
| `lastReviewed` | yes | `YYYY-MM-DD`, not in the future. |
| `relatedLinks` | no | Max 3. Internal paths only. Link text must make sense alone (no "here", "read more"). |
| `cta` | no | `{label, href}`. Internal path, `mailto:` or `https:`. |
| `schema` | no | Default `false`. Opt-in JSON-LD. Published only. |
| `schemaPage` | if `schema` and several targets | Which page owns the JSON-LD. Must be one of `pageTargets`. |
| `supersededBy` / `archivedReason` | one required when archived | Where the content went, or why it was retired. |

**Tagging model:** `topic` = where it belongs (one value, grouping). `audience` = who it's for (many). `tags` = anything else. `pageTargets` = where it appears.

**Build-time checks** (`src/lib/faqs.ts`): duplicate questions fail the build; bad `supersededBy` fails; entries not reviewed for 365 days warn; leftover `[[PLACEHOLDER]]` warns, and **fails under `npm run build:strict`** (use that in CI before deploy).

## 4. Embedding, reuse and staleness

- **One FAQ, many pages:** list the pages in `pageTargets` (`[faq, speaking]`). The same file renders everywhere, so editing it updates every page. Don't copy answers into page copy.
- **Contextual embedding:** `<FaqSection page="speaking" limit={6} />` near the end of a page. Use `filter={{ topic: 'speaking', tags: ['virtual'] }}` for tag-based selection, or `entries={await getFaqs({...})}` for full control.
- **No duplicates:** one entry per question; the build rejects the same question twice.
- **No stale answers:** `lastReviewed` plus the 365-day warning. Archive rather than leave a wrong answer live.

**Editorial workflow:** `draft` (visible only in `astro dev`, with a "Draft" badge) → review (you, or a second reader via pull request) → set `status: published` and update `lastReviewed` → later `archived` with `supersededBy` or `archivedReason`. Deleting the file is also fine once nothing links to it.

## 5. Components

All are server-rendered. JavaScript exists only in `FaqSearch` (filter box) and a 6-line script in `Faq` that opens a collapsed answer when the URL hash points at it.

**`Faq`** `{ entry, headingLevel?: 2–6 = 3, collapsible?: false, open?: false, idPrefix?: '', showCta?: true, showRelated?: true, showReviewed?: false }`
Default renders `<article id><h3>Question</h3><div>Answer</div><ul>related</ul><p>cta</p></article>`. `collapsible` renders `<details id><summary>Question</summary>…</details>` (works without JS; trade-off: the question is a summary, not a heading).

**`FaqList`** `{ entries? | filter? | page?, limit?, groupBy?: 'none'|'topic' = 'none', headingLevel? = 3, collapsible?, showViewAll?: boolean|'auto' = 'auto', viewAllHref? = '/faq/', viewAllLabel?, groupLinks? = false, showReviewed?, idPrefix? }`
`headingLevel` is the list's top heading; grouped lists put questions one level lower. `'auto'` shows "View all frequently asked questions" only when `limit` hid something.

**`FaqSection`** `{ page?, filter?, entries?, title? = 'Frequently asked questions', headingLevel? = 2, intro?, limit?, collapsible?, cta?: {label, href, text?}, schema? = false, showViewAll?, viewAllHref?, id? = 'faq' }` plus a default slot for rich intro text.
Renders `<section aria-labelledby><h2>…</h2><p>intro</p>…list…<div>cta</div></section>`, or nothing if no FAQ matches.

**`FaqPage`** `{ entries?, page? = 'faq', search? = true, collapsible? = false, showReviewed?, navLabel? }`
`<nav aria-label="FAQ topics">` of anchors, then `<div id="faq-topic-x"><h2>Topic</h2><p><a>link to service page</a></p>` + articles. Put the `<h1>` in the page.

**`FaqSearch`** `{ label?, id? }`
Rendered `<search hidden>` with a labelled `<input type="search">` and a polite status line; the script unhides it, filters `[data-faq-item]` on every term (AND), hides empty groups, Escape clears. Without JS nothing changes and all answers remain.

Usage:

```astro
<FaqSection page="speaking" limit={6} cta={{ label: 'Send a speaking enquiry', href: '/contact/?topic=speaking' }} />
<FaqSection page="work/example-case-study" title="Questions about this project" schema />
<FaqPage />   <!-- on /faq/ -->
```

## 6. Structured data: recommendation

**Don't enable it by default, and for this site I'd leave it off.** Google deprecated FAQ rich results in 2026, so there is no rich-result benefit to chase, and nothing here claims eligibility. Semantic HTML with clear question headings is what helps readers and search engines. The kit still supports FAQPage JSON-LD, strictly opt-in, in case you want it for other consumers:

1. Entry must set `schema: true` **and** the page must pass `schema` to `FaqSection`.
2. Only the page named by `schemaPage` (or the sole target) emits it, so a reused FAQ never produces duplicate FAQPage data across the site.
3. The JSON-LD answer is the exact HTML Astro renders for the visible answer (via the Astro container), so markup and visible text cannot drift. Only FAQs actually shown (after `limit`) are included.
4. Emit it once per page. Don't use `schema` on more than one `FaqSection` per page.

## 7. Accessibility checklist (WCAG 2.2 AA)

- [ ] Questions are real headings in a sensible order (h1 page → h2 section/topic → h3 question); no skipped levels.
- [ ] Answers are visible without JS; `<details>` works without JS; search is hidden until JS runs.
- [ ] Everything is operable by keyboard: Tab to links/summaries, Enter/Space toggles, Escape clears search.
- [ ] Visible focus on summaries, links, buttons and the search box (3px outline plus a Canvas ring; forced-colors handled).
- [ ] Targets are at least 44px high (above the 24px minimum of 2.5.8).
- [ ] No redundant ARIA: native `<search>`, `<nav>`, `<details>`, headings; only `aria-labelledby` on the section, `aria-label` on the topic nav, and `role="status"` on the result count.
- [ ] Link text is descriptive; the schema rejects "here"/"read more".
- [ ] Colour never carries meaning alone; text inherits your theme so contrast follows your tokens (check `--color-link` ≥ 4.5:1).
- [ ] Manual test: keyboard only through `/faq/`, `/speaking/` and a collapsible list; screen reader (NVDA+Firefox or VoiceOver+Safari): heading navigation lists the questions, the search status is announced once per change, and a hash link like `/faq/#general-fees-and-quotes` lands on the right item.
- [ ] Zoom to 200% and 400%/320px width: no horizontal scroll.

## 8. Editorial guide

- **Make it an FAQ when** the same practical question keeps arriving and the answer is short, stable and self-contained. **Make it page copy when** the answer is the page's main message, needs a story, or more than ~120 words. If three FAQs say the same thing, move it into the page and archive them.
- **Length:** 40–120 words; one idea; the answer in the first sentence.
- **Voice:** first person, plain, specific; say what you do, not what you "pride yourself on".
- **No promises you can't keep:** prices, availability, response times and credentials only if current and true. Use a placeholder until you know.
- **Avoid duplication:** search `content/faqs/` first; extend `pageTargets` instead of copying. Legal, privacy, accessibility and content-reuse detail belongs on policy pages; an FAQ may link to them.
- **Link to the next step:** finish with one `relatedLinks` entry or a `cta` pointing to the logical next page, with descriptive text.
- **Review cadence:** each FAQ at least yearly (the build warns at 365 days); revisit all service FAQs when the service changes; check the contact and fees FAQs quarterly.
- **Retire when** the question stops arriving, the answer moved into page copy, or the service ended. Set `status: archived` with `supersededBy` or `archivedReason`; delete the file later if no links remain.

## 9. Maintenance checklist

- [ ] New FAQ: copy a similar file, check the name prefix, set `status: draft`, preview with `astro dev`.
- [ ] Before publishing: no `[[PLACEHOLDER]]`, `lastReviewed` today, links work. Run `npm run build:strict`.
- [ ] Monthly: skim build warnings (stale entries).
- [ ] When a service page changes: edit its FAQs in the same pull request.
- [ ] When adding a topic: add it in `faq-meta.ts` (id, label, service URL).
- [ ] Never rename a published file; archive and create a new one instead.
- [ ] Optional later: add Decap or Tina pointed at `src/content/faqs/` for a visual editor. The schema maps directly to its fields.

## Install into your project

1. Copy `src/content.config.ts` (merge if you have one), `src/lib/`, `src/components/faqs/`, and `src/content/faqs/`.
2. `npm i -D @types/node` (used for the `FAQ_STRICT` flag).
3. Make sure `astro.config.mjs` has `trailingSlash: 'always'` (or adjust the `/faq/` links).
4. Add `pages/faq/index.astro` and drop `<FaqSection>` into service pages; delete the stub layout and the sample `[[PLACEHOLDER]]` content as you replace it.
5. Links to `/coaching/`, `/science-communication/`, `/writing/`, `/research/`, `/work/`, `/contact/` and `/content-reuse/` assume those pages exist; adjust in `faq-meta.ts` and the FAQ files.
