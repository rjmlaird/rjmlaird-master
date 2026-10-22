# @rjmlaird/glossary

Links `[term]` references in Markdown and MDX to the canonical definition on
**https://glossary.rjmlaird.co.uk/**. Definitions live only there; this package carries
term metadata and a remark plugin. It creates no routes and renders no definitions locally.

## Authoring

```md
[Earth observation]                 -> link, text "Earth observation"
[earth-observation]                 -> link by slug, text "Earth observation"
[synthetic aperture radar|SAR]      -> link, text "SAR"
[SNR]                               -> alias of "Signal-to-noise ratio"
\[sic\]                             -> literal brackets, never linked
```

Only explicit brackets are linked; ordinary words never are. Matching is case-insensitive and
treats hyphens and spaces alike (`[Remote sensing]` = `[remote-sensing]`). Resolution order is
the same for all: term name, slug, then aliases. Do not write ordinary Markdown links for glossary
terms unless you intentionally want a different URL.

Not linked: existing links, inline code, fenced code, raw HTML, MDX `<a>`, footnotes `[^1]`,
task-list `[x]`, numbers `[1]`, and anything that is not word-like (`[...]`).

Output is a plain `<a href="https://glossary.rjmlaird.co.uk/{slug}/" class="glossary-link">`. No JavaScript.
Styling is in `src/styles/global.css` (`a.glossary-link`).

## Strict mode

Default: an unknown reference **fails the build** with the file and a suggestion:

```text
Unknown glossary reference "climte" in content file "src/content/blog/example.md".
Did you mean "Climate"?
```

`GLOSSARY_STRICT=0 pnpm build` downgrades this to warnings and leaves the text unchanged
(use it to find every offender while migrating content).

Troubleshooting an unknown term: check the spelling; check the term exists on the glossary
(and the manifest has been synced); add an alias if it is a common abbreviation; or escape
the brackets (`\[like this\]`) if they are not a reference.

## Where terms come from

`data/terms.json` is generated from the glossary repo (`src/content/terms/*.md`), sorted by slug,
validated (duplicate slugs, duplicate names, alias collisions, unsafe slugs all fail).

To add or change a term:

1. Add/edit `src/content/terms/<slug>.md` in `rjmlaird-glossary` and deploy it.
2. In this repo: `pnpm glossary:sync` (reads `../rjmlaird-glossary/src/content/terms`; override with
   `--from <dir>` or `GLOSSARY_TERMS_DIR`), or `node scripts/sync-glossary.mjs --url https://glossary.rjmlaird.co.uk/terms.json`
   once the glossary's `terms.json` includes `aliases` and `category` (see `glossary-terms-json.patch`).
3. Commit `packages/glossary/data/terms.json`.

`pnpm glossary:check` exits 1 if the committed manifest differs from the source.

## Commands

```bash
pnpm test:glossary     # package tests (node:test, no extra dependencies)
pnpm build             # astro sync && astro check && astro build
```

## Wiring (astro.config.mjs)

Astro 7 defaults to a Rust Markdown processor that does not run remark plugins, so the site uses the
`unified()` processor from `@astrojs/markdown-remark`; MDX inherits it:

```js
import { unified } from "@astrojs/markdown-remark";
import { remarkGlossaryLinks } from "./packages/glossary/src/index.js";

markdown: { processor: unified({ remarkPlugins: [[remarkGlossaryLinks, { strict: true }]] }) }
```

`src/lib/rehype-table-align.mjs` keeps GFM table alignment as inline `text-align` (the unified processor
emits the legacy `align` attribute otherwise).

## Using it from another Astro site

The package has no dependencies and imports no Astro code. Copy `packages/glossary` (or publish it, or
add it as a workspace/Git dependency), import `remarkGlossaryLinks` as above, and run the sync script
against the glossary. The glossary and each site stay independently deployable.

## Releasing

Manifest change = commit `data/terms.json`. Code change = bump `version` in `package.json`.
