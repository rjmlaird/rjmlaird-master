# Changes (copy over repo root, keeping paths)

Deleted: src/pages/work/talks.astro (byte-identical copy of articles.astro; now redirects to /work/events/ in astro.config.mjs), src/data/nav.json (stale, unused).

Nav: legacy nav CSS removed from global.css; Nav.astro: sticky, z-index 500, solid dropdown, hover open, right-edge clamp, scrollable mobile menu, DOM order left/center/right.
Root cause of broken heroes: global `header:not(.page-head)` rule (specificity 0,1,1) beat .pg-head/.vg-head; now :where(header:not([class])).
New: components/Index/IndexHero.astro, CardGrid.astro. Rewritten: Filters.astro, ProjectCard.astro (data-* hooks), events/case-studies/initiatives/projects index pages, work/index.astro.
Nav items: Work = Case studies, Projects, Initiatives, Events, Videos, Editorial; Research + Podcasts moved to Insights; Initiatives removed from About (now in Work).

Not done: duplicate project files (n-body, grbs, p2010a2, tp-ambient), placeholder case-study text/images, middleware fallback credentials, .gitignore.
