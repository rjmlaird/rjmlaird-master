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
