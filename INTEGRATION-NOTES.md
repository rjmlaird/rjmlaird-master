# Integration notes

Verified: `astro check` 0 errors; `astro build` 464 pages.

## Applied
- components-refactor: all component, lib/routes, lib/sidebar, utils changes; 15 orphaned files deleted.
- Loose Footer, Breadcrumbs, BlogLayout, ProjectLayout adopted. Their hard-coded paths now use `lib/routes.ts`
  (blog crumb `/blog/` -> `/insights/blog/`; event crumb `/events/` -> `/work/events/`).
- PodcastLayout / VideoLayout: shared Breadcrumbs, real routes (`/podcasts/`, `/videos/` did not exist); VideoLayout undefined tokens replaced with `--ink2` / `--card`.
- Dead links fixed via `entryHref`: category, tags, sectors, authors, home latest-post, sectors index, insights index, `/dev/` link, press-mentions, markdown links in content (`/case-studies/`, `/videos/` etc).
- FAQ kit: collection registered in content.config.ts (definition in lib/faq-collection.ts), lib/faqs.ts, lib/faq-meta.ts, components/faqs, content/faqs, /faq/ page on the real Layout. Tokens mapped to site tokens (`--focus`, `--teal`).
- FaqSection wired into the four service pages and case-study pages (ProjectLayout).
- Routes remapped: speaking -> /services/speaking-collaboration/, coaching -> /services/teaching-mentoring/, communication and writing -> /services/strategic-communication/; case-study FAQ target is `work/case-studies/*`.

## Decisions you should check
1. FAQ answers are now drafted and published (30 live, `FAQ_STRICT=1 astro build` passes). I wrote them from what the repo already states (tutoring data, service pages, legal contact). **Review before deploy**, especially claims I could not verify: tuition is online with a free 20-minute consultation, 60/75-minute sessions, AQA/Edexcel/OCR (marked unconfirmed in `tutoring/data`), under-18 bookings arranged with a parent or carer, `hello@rjmlaird.co.uk` as direct email, and the Leicester base. I deliberately gave no prices, response times, payment terms, notice periods or background-check claims; answers say these are agreed in writing. Add specifics when you want to commit to them.
   The four `projects-example-*` FAQs need per-project answers, so they are `archived`; copy them per case study.
2. `writing-republishing` linked to `/content-reuse/` (no such page); now points to /contact/ with a new label. Change when the policy page exists.
3. Uploaded `global.css` NOT applied: it is a different (light, serif) token set with none of the tokens master uses (`--ink`, `--card`, `--teal`, `--bd`...). Replacing would break the site. If it was meant for another repo, ignore; otherwise tell me.
4. `trailingSlash: 'always'` from the kit not added to astro.config (would change behaviour for existing routes).

## Policy pages (added)
`src/pages/[policy].astro` renders `@rjmlaird/policies` on the existing LegalNotice layout (vite `ssr.noExternal` added to astro.config).
A policy containing `[[TODO]]` is built only in `astro dev`; production skips it with a warning.
- Built now: `/terms-of-use/`, `/disclaimer/`, `/accessibility/`.
- Held back: `/privacy/` (2 TODOs in content/privacy.md: special-category data line, newsletter section) and `/cookies/` (4 TODOs). The footer still links `/privacy/`, so it 404s until you resolve them (edit in the policies repo, bump the tag in package.json) or decide the footer should not link it yet.
- `components/legal/*` stays orphaned: the package-driven page does not use it. Delete it if you are happy with this route.

## Still open
- `PostCard`/`ProjectCard`/`PodcastCard` and the row cards still duplicate structure (needs visual diff).
- Build here couldn't reach api.rjmlaird.co.uk or Substack (sandbox), so those sections built from fallbacks.
- `package-lock.json` / `pnpm-lock.yaml` untouched; no new dependencies (FAQ kit uses only `astro/container`, built in).

---

# Glossary linking (added)

`[term]` / `[term|text]` in Markdown and MDX now link to https://glossary.rjmlaird.co.uk/{slug}/. See `packages/glossary/README.md`.

- Package: `packages/glossary` (`@rjmlaird/glossary`): zero dependencies, manifest + resolver + remark plugin + types. Imported by relative path from `astro.config.mjs`.
- Manifest: `packages/glossary/data/terms.json`, generated from the glossary repo's 22 terms by `pnpm glossary:sync`; validated (dup slugs/names, alias collisions, unsafe slugs).
- Astro 7 defaults to a Rust Markdown processor that ignores remark plugins, so `markdown.processor` is now `unified()`; `@astrojs/markdown-remark` is a new direct dependency (`pnpm-lock.yaml` updated; `--frozen-lockfile` verified). `package-lock.json` NOT updated (CI uses pnpm).
- Processor-switch diff: all 464 pages compared before/after. Only differences: entity style (`&#x26;` vs `&amp;`, equivalent), plus table alignment (restored via `src/lib/rehype-table-align.mjs`), one cosmetic change (`...` becomes `…` in the displayed text of one URL in `gaia.md`; href unchanged), and `/dev/open-source/` (live GitHub fetch, unrelated).
- Strict by default: unknown references fail the build with file + suggestion. `GLOSSARY_STRICT=0` downgrades to warnings. The only stray bracket in existing content (`[PDF]` in `gaia.md`) is now escaped.
- Tests: `pnpm test:glossary` (20 tests, node:test); added to `deploy.yml` before the build.
- Style: `a.glossary-link` (dotted underline, solid on hover/focus) in `src/styles/global.css`.

## Needs your action
1. The glossary has no `climate`, `climate-change` or `synthetic-aperture-radar` terms yet, so those examples fail in strict mode. Add the terms in `rjmlaird-glossary`, deploy, then `pnpm glossary:sync`.
2. `glossary-terms-json.patch` (for the glossary repo) adds `aliases` and `category` to its `terms.json`, enabling `sync --url`. Not applied there.
3. No existing page uses `[term]` yet; I verified on a real MDX post and reverted that edit.
