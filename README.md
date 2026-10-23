# rjmlaird-master

Source for [rjmlaird.co.uk](https://rjmlaird.co.uk), the personal and professional site of Ryan Laird: astrophysicist, science communicator and digital strategist. It is a static [Astro](https://astro.build) site with Markdown/MDX content collections, a shared dark design system, schema.org structured data and a set of build-time quality gates.

> Last reviewed: 22 October 2026, against Astro 7.x, Zod 4 and Node 22. The [Known issues](#known-issues) section lists problems verified on that date.

## Contents

1. [Stack and requirements](#stack-and-requirements)
2. [Quick start](#quick-start)
3. [Commands](#commands)
4. [Repository layout](#repository-layout)
5. [Routes](#routes)
6. [Content model](#content-model)
7. [Work detail pages: layout, Impact and Outputs](#work-detail-pages-layout-impact-and-outputs)
8. [Design system and accessibility conventions](#design-system-and-accessibility-conventions)
9. [Data files](#data-files)
10. [Integrations and subsystems](#integrations-and-subsystems)
11. [Environment variables](#environment-variables)
12. [Quality gates and audits](#quality-gates-and-audits)
13. [Deployment](#deployment)
14. [Known issues](#known-issues)
15. [Other documents in this repo](#other-documents-in-this-repo)

## Stack and requirements

| Item | Detail |
|---|---|
| Framework | Astro 7 (static output), `astro-icon`, MDX, `@astrojs/sitemap` |
| Language | TypeScript 6 (checked with `@astrojs/check`); plain `.mjs` for scripts |
| Validation | Zod 4 schemas for every content collection |
| Styling | Hand-written CSS: global tokens in `src/styles/global.css`, shared page styles in `src/styles/pages.css`, scoped `<style>` blocks in components |
| Package manager | pnpm 11.11 (used in CI). `package-lock.json` is also present; see [Known issues](#known-issues) |
| Node | 22 (matches CI) |
| Hosting | GitHub Pages with a custom domain (`CNAME`) |

`pnpm-workspace.yaml` sets `minimumReleaseAge: 1440` (dependencies must be at least a day old) with a short allow-list, and controls which packages may run install scripts (`esbuild`, `workerd` and `sharp` yes; `citation-js` no).

## Quick start

```bash
corepack enable                      # or: npm i -g pnpm@11.11.0
pnpm install --frozen-lockfile
pnpm dev                             # http://localhost:4321
```

`@rjmlaird/policies` is installed from GitHub (`github:rjmlaird/rjmlaird-policies#v0.1.0`), so the first install needs network access to GitHub.

Optional for local work: create a git-ignored `.env` containing `GITHUB_TOKEN` so the `/dev/` pages can fetch repository data without anonymous rate limits. See [Environment variables](#environment-variables).

## Commands

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server. Policies containing `[[TODO]]` markers render here but not in production. |
| `pnpm build` | `astro sync && astro check && astro build`. Fails on type errors, invalid content and unknown glossary terms. |
| `pnpm preview` | Serves `dist/` locally. |
| `pnpm sync` | Regenerates Astro content types. |
| `pnpm audit:content` | Lists work entries that are not yet evidence-ready. **Currently broken**; see [Known issues](#known-issues). |
| `pnpm audit:schema` | After a build, validates the JSON-LD on every built page. Exits 1 on errors. |
| `pnpm audit:a11y` | axe-core (WCAG 2.0/2.1/2.2 A and AA, plus best practice) over built pages. Needs `playwright` and `axe-core` installed first (see the script header). `PAGES=/,/contact/ pnpm audit:a11y` overrides the page list. |
| `pnpm glossary:sync` / `glossary:check` | Regenerate or verify `packages/glossary/data/terms.json` from the canonical glossary. |
| `pnpm test:glossary` | Unit tests for the glossary package (`node --test`). |
| `pnpm brand:tokens` / `brand:validate` | Intended to regenerate and validate brand design tokens. **Currently broken**; see [Known issues](#known-issues). |

A sensible pre-merge check:

```bash
pnpm build && pnpm audit:schema
```

## Repository layout

```
.
├── astro.config.mjs        # integrations, sitemap filter, glossary remark plugin, vite aliases
├── .github/workflows/      # deploy.yml: build and publish to GitHub Pages
├── CNAME                   # custom domain
├── docs/                   # strategy and migration notes
├── forms/                  # contact.php and notes (legacy form handler)
├── functions/              # _middleware.ts: Cloudflare Pages Function (analytics basic auth)
├── packages/glossary/      # local package: [term] -> glossary.rjmlaird.co.uk remark plugin
├── public/                 # static assets copied as-is (css, js, images, vendor, robots.txt)
├── scripts/                # audits, glossary sync, legal TODO check
└── src/
    ├── brand/              # brand system code (components, layouts, tokens, lib)
    ├── components/         # shared Astro components (plus Sidebar/, Schema/, faqs/, legal/, dev/)
    ├── content/            # Markdown/MDX collections (see below)
    ├── content.config.ts   # collection definitions and Zod schemas
    ├── data/               # JSON/TS data files (nav, profile, CV, socials, schema seed, ...)
    ├── layouts/            # Layout, ProjectLayout, BlogLayout, PodcastLayout, VideoLayout, LegalNotice
    ├── lib/                # routes, sidebar builders, content-quality gate, schema.org, FAQ helpers, API client
    ├── pages/              # file-based routes
    ├── sections/           # page sections (home, about)
    ├── styles/             # global.css, pages.css, guides.css
    ├── tutoring/           # code carried over from the former tutoring site
    ├── types/
    └── utils/
```

### Content directories

| Path | Collection | Entries (22 Oct 2026) |
|---|---|---|
| `src/content/work/projects/` | `projects` | 46 |
| `src/content/work/case-studies/` | `caseStudies` | 9 |
| `src/content/work/initiatives/` | `initiatives` | 9 |
| `src/content/work/events/` | `events` | 51 |
| `src/content/insights/blog/` | `blog` | 4 |
| `src/content/insights/podcasts/` | `podcasts` | not counted |
| `src/content/services/` | `services` | coaching and mentoring guides |
| `src/content/about/authors/` | `authors` | not counted |
| `src/content/faqs/` | `faqs` | 34 |
| `src/content/brand/docs/` | `brandDocs` | brand documentation |
| (see `content.config.ts`) | `brandAssets`, `brandSites` | brand asset and site records |

## Routes

Defined by `src/pages/` and centralised in `src/lib/routes.ts` (use `entryHref` rather than hard-coding paths).

| Area | Routes |
|---|---|
| Home | `/` |
| About | `/about/`, `/about/bio/`, `/about/organisations/`, `/about/press/`, `/about/authors/…`, `/about/brand/…` |
| Work | `/work/`, `/work/projects/`, `/work/case-studies/`, `/work/initiatives/`, `/work/events/`, `/work/videos/`, `/work/articles/`, `/work/talks/`, `/work/editorial/` (with `[slug]` detail pages where applicable) |
| Services | `/services/`, `/services/strategic-communication/`, `/services/digital-strategy-systems/`, `/services/teaching-mentoring/`, `/services/speaking-collaboration/` |
| Insights | `/insights/`, `/insights/blog/`, `/insights/podcasts/`, `/insights/resources/`, `/insights/sectors/`, `/insights/substack/` |
| Research | `/research/`, `/research/publications/` (bibliography from `src/data/publications.bib`) |
| Dev | `/dev/`, `/dev/open-source/`, `/dev/projects/`, `/dev/stack/` (live GitHub data at build time) |
| Taxonomy | `/tags/`, `/tags/[tag]/`, `/category/[category]/` |
| Other | `/contact/`, `/how-i-work/`, `/faq/`, `/thank-you/` |
| Policies | `/terms-of-use/`, `/disclaimer/`, `/accessibility/` (see [Policies](#policies)) |

## Content model

All collections are defined in `src/content.config.ts`. The work collections (`projects`, `caseStudies`, `initiatives`) and `events` share a base schema; `workSchema` adds `title`, `summary`, `type`, `status` (`active`, `completed` or `archived`) and `year`.

Notable shared fields: `description`, `startDate` / `endDate` / `updatedDate`, `tags`, `category`, `sectors`, `links`, `heroImage` / `heroAlt` / `imageCredit`, `youtubeId`, `client` / `organisation` / `institution`, the `related*` cross-reference arrays (experience, education, organisations, volunteering, awards, projects, case studies, initiatives, events, videos, articles), `toolsTech`, `features`, `impact`, `draft`, `noindex` and `canonical`.

Optional case-study fields: `evidenceReady`, `role`, `collaborators`, `challenge`, `objectives`, `approach`, `outputs`, `outcomes`, `testimonial`. At the time of writing only `role` is used in content.

### Evidence-ready gate

`src/lib/content-quality.mjs` decides whether a project, case study or initiative is substantial enough to index.

- `isEvidenceReady(data, body)` returns the `evidenceReady` front-matter value if it is a boolean; otherwise it runs `assessEntry`, which looks for template placeholder text and thin pages.
- A page that fails is rendered with `noindex` and is meant to be left out of the sitemap (see [Known issues](#known-issues) for the sitemap part).
- `cleanText` and `cleanLinks` strip placeholder strings and template links (for example `github.com/yourname/example-project`) so they never reach visitors.

To publish a thin entry: write a real description and a body covering challenge, role, work, outputs and outcomes, or set `evidenceReady: true` to override the check deliberately.

### Writing content

- Front matter is validated at build time; a bad entry fails the build and names the file.
- Link glossary terms with `[term]`, `[term|display text]` or `[slug]` (see [Glossary](#glossary)). Escape literal brackets as `\[like this\]`.
- Internal links in Markdown should use current routes (`/work/case-studies/…`, not the old `/case-studies/…`).

## Work detail pages: layout, Impact and Outputs

Applies to projects, case studies, initiatives and events (`src/pages/work/*/[slug].astro`, wrapped by `src/layouts/ProjectLayout.astro`).

```
ProjectLayout            breadcrumbs, title, hero, metadata
└─ .project-layout       grid
   ├─ .project-main      intro, video, Markdown body (.prose), Impact
   └─ ProjectSidebar     sectors, tools, related items, links
```

- DOM order is content first, sidebar second, so keyboard and screen-reader order matches the visual order at every width.
- Below 64rem the layout is one column. From 64rem it is the main column plus a 17rem sticky sidebar on the right; the sidebar scrolls independently if it is taller than the viewport. If an entry has no sidebar sections, the main column takes the full width.
- The layout CSS lives in `src/styles/pages.css`. `.prose` is applied to the Markdown body only (max width 46rem), not to the grid.
- `/work/videos/[slug]` uses the same class names with a different structure and is not part of the two-column layout.

### Impact and outputs

`src/components/ImpactStats.astro` renders the free-form `impact` front-matter record according to the shape of each value:

| Value | Rendered as |
|---|---|
| Short string, number or boolean (48 characters or fewer) | Stat tile in a `<dl>` grid |
| Longer string (for example `summary`, `contribution`, `methods`) | Labelled paragraph |
| Array (for example `outcomes`, `outputs`) | Labelled bulleted list |
| Nested object | List of `Key: value` lines |

It also accepts a top-level `outputs` array and shows it as an "Outputs" list unless `impact.outputs` already exists. It renders nothing when there is no usable content. The section carries its own heading (`aria-labelledby`), so pages must not wrap it in another `<section>` or `<h2>`.

```yaml
impact:
  outcome: Improved discoverability
  engagement: High
  summary: >
    A longer description of what changed and why it mattered.
  outcomes:
    - First outcome
    - Second outcome
  outputs:
    - Poster and presentation material
```

## Design system and accessibility conventions

Tokens are CSS custom properties in `src/styles/global.css` (`:root`):

| Group | Tokens |
|---|---|
| Surfaces | `--ink`, `--ink2`, `--card`, `--lift` |
| Text | `--w` (primary), `--mb` (secondary), `--m` (muted). Comments in the file record that `--mb` and `--m` meet 4.5:1 on `--ink` and `--card`; avoid `--m` for small text on `--lift`. |
| Accents | `--teal`, `--amber`, `--violet`, `--coral`, `--green`, `--sky`, each with dim-fill and border variants |
| Lines and focus | `--bd`, `--bm`, `--focus` |
| Layout | `--content-max`, `--gutter`, `--section-y`, `--nav-h`, `--radius` |
| Semantic aliases | `--color-text`, `--color-text-muted`, `--color-surface`, `--color-border`, `--color-accent`, `--color-accent-subtle` (used by shared components such as `StatCard` and `FactBox`) |

Other `--color-*` names appear in some components (for example `--color-border-default`, `--color-text-primary`, `--color-site-*`) but are not defined in this repo. Give them a fallback or map them before relying on them.

**Gotchas in the global CSS**

- Bare `nav`, `header` and `footer` elements are styled globally (nav as the sticky top bar, footer as a flex row). A component that needs a different `nav` or `footer` must reset those properties, as `Footer.astro` and `ProjectLayout.astro` do.
- `scopedStyleStrategy: "class"` is set, so scoped styles use class selectors and built HTML carries `astro-xxxx` classes.

**Accessibility conventions in the shared components**

- Skip link and `.sr-only` utilities in `global.css`; visible `:focus-visible` outlines in teal or `--focus`.
- Landmarks are labelled; link groups are labelled by their headings.
- Links that open a new tab say so in text ("(opens in a new tab)").
- Footer: one labelled navigation with headed lists, 44px link targets on touch devices (`pointer: coarse`), auto-fitting columns that collapse to a single column on narrow screens, safe-area padding, a forced-colours style and `prefers-reduced-motion` support.
- Sidebar chips, links and lists use real list semantics.
- Run `pnpm audit:a11y` after a build. It is a floor, not a substitute for keyboard and screen-reader testing.

## Data files

`src/data/` holds structured data used across pages.

| File | Purpose |
|---|---|
| `nav.json` | Primary and utility navigation |
| `profile.json`, `cv.json`, `expertise.json`, `milestones.json` | Profile and CV content. `cv.json` has a `complete` flag; while `false`, the CV is treated as a stub |
| `socials.json` | Social links. Only entries with `"verified": true` reach schema.org `sameAs` |
| `schema-org.json` | Seed facts for structured data (organisations, education, credentials, languages) |
| `selected-work.json`, `featured-research.json`, `articles.json`, `podcasts.json`, `videos.json`, `events.json`, `press-mentions.json` | Curated lists for the home, work and insights pages |
| `open-source.json`, `experiments.json`, `systems.json`, `dev/` | Curated open-source and dev data |
| `publications.bib` | Bibliography rendered at `/research/publications/` (via `citation-js`) |
| `enquiries.json` | Contact routing |
| `guides/` | Navigation for the mentoring and coaching guides |
| `legal.ts` | Legal link registry used by the footer and policy pages |

Data that originates in other systems (CV items, awards, experience) is read through `src/lib/api.ts`, which uses `api.rjmlaird.co.uk`.

## Integrations and subsystems

### Structured data (schema.org)

Every page emits one JSON-LD `@graph`, built in `src/lib/schema-org/` and rendered by `Layout.astro`.

- `src/data/schema-org.json` is the seed; edit facts there.
- `source.ts` merges the seed with live data from `api.rjmlaird.co.uk` at build time (6 second timeout, per-item validation, falls back to the seed if the API is unreachable).
- `graph.ts` builds the cross-linked graph: WebSite, WebPage / ProfilePage / ContactPage, Person, ImageObject, BreadcrumbList and Organization, all linked by `@id`.
- Pages about Ryan carry the full Person profile; other pages carry a light Person node. Blog, podcast, video and project layouts pass their entity through `mainEntity`.
- `pnpm build && pnpm audit:schema` checks every built page: valid JSON, one block, unique `@id`s, no dangling references, required nodes and no placeholder values.

### Glossary

`packages/glossary` is a local package whose remark plugin is registered in `astro.config.mjs` through the unified processor.

- Definitions live at `glossary.rjmlaird.co.uk`; this repo stores only term metadata in `packages/glossary/data/terms.json`.
- An unknown `[term]` fails the build with a suggestion. Set `GLOSSARY_STRICT=0` to downgrade to warnings.
- Links get the class `glossary-link` and a dotted underline (styled in `global.css`), so the cue is not colour alone.
- `pnpm glossary:sync` regenerates the term file (set `GLOSSARY_TERMS_DIR` or pass `--from`); `pnpm glossary:check` verifies it is current. Full syntax is in `packages/glossary/README.md`.

### Policies

`src/pages/[policy].astro` renders the legal policies from the `@rjmlaird/policies` package on the `LegalNotice` layout. A policy that still contains `[[TODO]]` markers is built only under `astro dev`, so placeholder text cannot reach production.

Built now: `/terms-of-use/`, `/disclaimer/` and `/accessibility/`. Held back until their TODOs are resolved in the policies repo: `/privacy/` and `/cookies/`. To release one, edit the policies repo, tag it, and bump the version in `package.json`.

### FAQs

One collection (`src/content/faqs/`, one file per FAQ, file name is the stable id) feeds `/faq/` and the contextual FAQ sections on service and case-study pages. Topics, audiences and target URLs are in `src/lib/faq-meta.ts`; helpers and JSON-LD are in `src/lib/faqs.ts`; components are in `src/components/faqs/`. `FAQ_STRICT=1 pnpm build` makes FAQ validation failures fatal. The design rationale is in `README copy.md`.

### Dev section (GitHub data)

The `/dev/` pages query the GitHub API at build time through `src/lib/github.ts`, using `GITHUB_TOKEN` (provided automatically in CI) and `DEV_TOKEN` (a repository secret).

### Brand system

`src/brand/` and `src/content/brand/` implement the brand documentation under `/about/brand/…`. Its styles are scoped so they cannot leak into the rest of the site.

### Tutoring code

`src/tutoring/` is code and data carried over from the former tutoring site. There is no `/tutoring/` route in `src/pages/` at present.

## Environment variables

| Variable | Used by | Purpose |
|---|---|---|
| `GITHUB_TOKEN` | `src/lib/github.ts`, CI | GitHub API access for `/dev/` data |
| `DEV_TOKEN` | `src/lib/github.ts`, CI | Additional token for dev data |
| `GLOSSARY_STRICT` | `astro.config.mjs` | `0` makes unknown glossary references warnings |
| `GLOSSARY_TERMS_DIR` | `scripts/sync-glossary.mjs` | Source directory for glossary sync |
| `FAQ_STRICT` | `src/lib/faqs.ts` | `1` makes FAQ validation fatal |
| `PAGES` | `scripts/a11y-check.mjs` | Comma-separated page list for the accessibility audit |
| `ANALYTICS_USER`, `ANALYTICS_PASS`, `PLAUSIBLE_API_KEY` | `functions/_middleware.ts` | Cloudflare Pages Function only; not used by the GitHub Pages deployment |

`.env` and `.env.*` are git-ignored. Never commit tokens.

## Quality gates and audits

| Gate | When | Fails on |
|---|---|---|
| Content schemas (Zod) | `astro sync`, `build` | Invalid front matter |
| `astro check` | `build` | TypeScript and Astro errors (hints and warnings do not fail) |
| Glossary strictness | `build` | Unknown `[term]` references |
| Policy `[[TODO]]` filter | `build` | Not a failure: affected policies are skipped in production |
| `audit:schema` | After `build` | Invalid or inconsistent JSON-LD |
| `audit:a11y` | After `build` | axe-core violations on the audited pages |
| `check-legal-todos.mjs` | Manual, after `astro build` | Unresolved drafting text in `dist/` (not wired into `build`) |

## Deployment

`.github/workflows/deploy.yml` runs on every push to `main` and on manual dispatch:

1. Check out, configure Pages, install pnpm 11.11.0, set up Node 22 with the pnpm cache.
2. `pnpm install --frozen-lockfile`.
3. `pnpm run build` with `DEV_TOKEN` and `GITHUB_TOKEN` in the environment.
4. Upload `dist/` and deploy with `actions/deploy-pages`.

Notes:

- GitHub Pages cannot issue 301 redirects. Redirects for retired subdomains (`cv.`, `dev.`) must be configured on the hosts that serve those subdomains. `docs/SITE-STRATEGY-AND-MIGRATION.md` has the URL map and checklist.
- `dist/` is tracked in git in some copies of this repository. It is regenerated by every build and does not need to be committed.
- `functions/_middleware.ts` and the `@astrojs/cloudflare` dependency relate to a Cloudflare Pages deployment. `astro.config.mjs` does not use the Cloudflare adapter, so neither affects the GitHub Pages build.

## Known issues

Verified on 22 October 2026. None of these stop `pnpm build`.

| Issue | Detail | Suggested fix |
|---|---|---|
| `audit:content` crashes | `scripts/audit-content.mjs` reads `src/content/{case-studies,projects,initiatives}`, which moved to `src/content/work/…` | Point the root at `src/content/work` |
| Sitemap stub filter inactive | `astro.config.mjs` scans `src/content/<section>` and builds `/<section>/<slug>/` URLs, so no stub pages are excluded from the sitemap (the pages themselves are still `noindex`) | Scan `src/content/work/<section>` and use `/work/<section>/<slug>/` URLs |
| Sitemap `unindexed` pattern is stale | It still lists `mentoring`, `coaching`, `tutoring`, `brand` and several `research` sub-paths, most of which are no longer routes | Update it to current routes (for example `/about/brand/…` if that should stay out of the sitemap) |
| `brand:tokens` and `brand:validate` fail | `package.json` points at `scripts/brand/*.ts`, which does not exist | Restore the scripts or remove the commands |
| `/privacy/` and `/cookies/` return 404 | Held back by `[[TODO]]` markers in the policies package, but the footer links to `/privacy/` | Resolve the TODOs and bump the package tag, or remove the footer link until then |
| Two lockfiles | `pnpm-lock.yaml` (used by CI) and `package-lock.json` can drift apart | Keep one; pnpm while CI stays as it is |
| Undefined design tokens | Some components reference `--color-*` names that are not defined | Map them to existing tokens in `:root` |
| `check-legal-todos.mjs` not wired in | Its header says `build` should run it, but it does not | Add it to the `build` script |
| Stray files | `src/data/articles.json.bak`, `README copy.md`, `.DS_Store`, `.obsidian/` | Remove or git-ignore |

## Other documents in this repo

| File | What it covers |
|---|---|
| `docs/SITE-STRATEGY-AND-MIGRATION.md` | Site structure decisions, content status, URL consolidation map and launch checklist |
| `INTEGRATION-NOTES.md` | What was merged in the components refactor, FAQ kit and policy pages, with decisions to check |
| `CHANGES-phase-1-2.md`, `COMPONENTS-AUDIT.md`, `DELETED.txt` | History of earlier refactor phases and removed files |
| `README copy.md` | FAQ architecture, schema and authoring guide |
| `packages/glossary/README.md` | Glossary syntax, strict mode and sync workflow |
| `forms/Readme.txt` | Notes for the legacy contact form handler |
