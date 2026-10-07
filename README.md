# rjmlaird-master

Astro site for rjmlaird.co.uk. The former satellite sites now live inside it as sections:

| Section | Route | Source | Notes |
|---|---|---|---|
| Dev | `/dev/`, `/dev/open-source/`, `/dev/projects/` | rjmlaird-dev | Live GitHub data at build time; set `GITHUB_TOKEN` / `DEV_TOKEN` in CI. Curated `/open-source/` is unchanged. |
| Mentoring guide | `/mentoring/specialist/…` | rjmlaird-mentoring (MkDocs) | Markdown in `src/content/mentoring/`, nav in `src/data/guides/mentoring.json`. `/mentoring/` stays the main page. |
| Coaching | `/coaching/…` | rjmlaird-coaching (MkDocs) | Markdown in `src/content/coaching/`, nav in `src/data/guides/coaching.json`. |
| Research lab | `/research/lab/`, `/research/projects/` … | rjmlaird-research | Code in `src/research/`, content in `src/content/research/`. |
| Tuition | `/tutoring/…` | rjmlaird-tutoring | Code in `src/tutoring/`; data files hold prices, subjects, booking links. |
| Brand system | `/brand/…` | rjmlaird-brand | Code in `src/brand/`, docs in `src/content/brand/docs/`. `npm run brand:tokens` regenerates tokens. |

Mentoring, coaching, tuition, brand and research-lab pages are `noindex` and excluded from the sitemap
until reviewed. Remove `noindex` (layout) and the pattern in `astro.config.mjs` as each section launches.

The standalone sites kept their own light themes. Each is scoped to a wrapper class (`.rs`, `.tt`, `.bd`)
inside the shared dark layout, so their styles cannot leak into the rest of the site.

## Structured data (schema.org)

Every page emits one JSON-LD `@graph` built by `src/lib/schema-org/` and rendered by `Layout.astro`. It replaces the
separate schema on cv.rjmlaird.co.uk, so this site is now the single source of truth.

- `src/data/schema-org.json`: seed facts (organisations, education, credentials, languages, verified `sameAs`). Edit here.
- `source.ts`: merges the seed with live data from api.rjmlaird.co.uk at build time (6s timeout, per-item validation,
  falls back to the seed if the API is unreachable).
- `graph.ts`: builds the cross-linked graph: WebSite, WebPage/ProfilePage/ContactPage, Person, ImageObject,
  BreadcrumbList and Organization nodes, all linked by `@id`.
- Pages about Ryan (`/`, `/about/`, `/cv/`, `/contact/`, `/work-with-me/`, `/press/`) carry the full Person profile;
  other pages carry a light Person node. Blog, podcast, video and project layouts pass their entity via `mainEntity`.
- `socials.json` entries only reach `sameAs` when marked `"verified": true`.
- `npm run build && npm run audit:schema` checks every built page: valid JSON, one block, unique `@id`s, no dangling
  references, required nodes, no placeholder values.
