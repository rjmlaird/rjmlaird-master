# Phase 1 + 2: homepage layout and accessibility

Verified on a production build (`astro build`, `astro check`: 0 errors) rendered in headless Chromium at
320 / 375 / 768 / 1024 / 1440px, plus axe-core (WCAG 2.0–2.2 A/AA + best-practice): **0 violations on `/`** (was 5 rules failing).

## Before → after (homepage)

| Metric | Before | After |
|---|---|---|
| Text column at 375px | ~255px (text began at 60px) | 335px (starts at 20px) |
| h1 at 375px | 52.8px, 367px wide, clipped off-screen | 36px, fits, no clipping |
| Hero at 1440px | h1 stacked one word per line, 778px tall | h1 ~414px, portrait beside it |
| Project / mentoring / enquiry grids at 375px | 2 columns of ~100–119px | 1 column |
| Section left edges at 1440px | 140px vs 184px (misaligned) | one edge (184px) |
| Page height at 375px | 13,869px | ~10,500px |
| Primary button contrast | 1.88:1 | 8.46:1 |
| Standalone link height at 375px | 19px | ≥44px |
| `<main>` landmarks | 2 (nested) | 1 |

## Files changed

| File | Change |
|---|---|
| `src/pages/index.astro` | Rebuilt markup + CSS. All classes prefixed `hp-` so they no longer collide with the shared `.route`, `.split`, `.work-grid`, `.go`, `.home-hero`, `.home-block`, `.route-cta` rules in `pages.css`. Nested `<main>` replaced by `<div class="hp-root">`. One gutter source (`.hp-wrap`). Mobile-first grids (1 col → 2 at 48rem → 3 work cards at 72rem). Services section now inside the same wrapper as every other section. Fluid h1/h2 with sane line-height and tracking. Removed dead `.pathway*` CSS, the weaker scoped focus override, the duplicate `.sr-only`, and an invalid `aria-label` on a generic div. Section intro blocks are `<div>`s, not `<header>`s (global `header:not(.page-head)` was adding flex, padding and a border). |
| `src/styles/global.css` | New token `--on-accent: var(--ink)` for text on filled accent surfaces. |
| `src/components/Hero/Hero.astro`, `src/pages/how-i-work.astro`, `src/pages/contact.astro`, `src/pages/thank-you.astro` | `var(--bg)` (never defined) → `var(--on-accent)`. Fixes the same 1.88:1 button text colour site-wide. |
| `src/components/Nav.astro`, `src/components/Footer.astro` | Logo `aria-label` now contains the visible text ("RJMLaird, home page"), WCAG 2.5.3. |
| `scripts/a11y-check.mjs`, `package.json` | `pnpm audit:a11y` runs axe + horizontal-scroll check on built pages at 375 and 1280px. Needs `pnpm add -D playwright axe-core` once (not added to package.json so your lockfile is untouched). |

## Gotchas found along the way

- `global.css` already defines a bare `.hp` class (max-width 540px), hence `.hp-root`, not `.hp`.
- `Layout.astro` already provides `<main id="content">`; page templates should not add another.

## Not changed (deliberately; Phase 3+)

- Nested `<main>` also exists on `/contact/`, `/how-i-work/`, `/thank-you/`. I tried the same fix; those pages' padding depends on the nesting, so the layout shifted. Needs its own visual pass.
- Broken links (`/mentoring/`, `/teaching/`, `/blog/<slug>/`, nav/footer routes), `/contact/#communications` anchors, missing `og-default.jpg`.
- `/work/projects/` filter controls fail contrast (white on #6b6b6b selects; grey "clear" button).
- All content changes. The homepage still shows "Expanded case study in preparation" on placeholder cards.
- `dist/` is not included; run `pnpm build`.
