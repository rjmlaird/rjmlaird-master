# rjmlaird.co.uk: structure, content status and migration plan

Scope note: the brief supplied ended partway through section 11 (Green Orbit Digital relationship), so sections 11 onwards
were not available. Everything here follows sections 1 to 10 and the start of 11.

## 1. What changed in the repo

| Area | Change |
| --- | --- |
| Navigation | Home, Work with me, Research & writing, Projects, About, Contact. Utility: CV, Open source. Data in `src/data/nav.json`. |
| Homepage | Rebuilt as an orientation page: hero, credentials, four pathways, selected work, research and writing, teaching and mentoring, Green Orbit Digital, routed enquiry block. |
| New pages | `/work-with-me/`, `/consulting/`, `/mentoring/`, `/teaching/`, `/contact/`, `/about/`, `/cv/`, `/open-source/`, `/writing/`, `/research/` (hub). |
| Moved | The bibliography moved from `/research/` to `/research/publications/`. `/research/` is now the structured hub. |
| Content model | Optional case-study fields added to `content.config.ts`: `evidenceReady`, `role`, `collaborators`, `challenge`, `objectives`, `approach`, `outputs`, `outcomes`, `testimonial`. |
| Quality gate | `src/lib/content-quality.mjs` detects template text and thin pages. Thin pages are `noindex`, removed from the sitemap, and never show template text or fake links. `npm run audit:content` lists them. |
| Writing taxonomy | Nine topics in `src/lib/topics.ts`, mapped by keyword, with a no-framework filter on `/writing/`. |

## 2. Content status (the main remaining job)

`npm run audit:content` reports **0 of 61** projects, case studies and initiatives as evidence-ready. Almost all have
a one-line description copied from a third party or a template placeholder, and no body text. They are not deleted;
they are hidden from search until completed.

To publish a case study: fill the new front-matter fields and a body of at least 60 words covering challenge, role,
work, outputs and outcomes, then re-run the audit. Set `evidenceReady: true` to override the automatic check.

Suggested first six (matches `src/data/selected-work.json`): ESA Business Applications newsletter, GERB calibration,
Copernicus Hackathon Leicester, Bake In Space, DiscovAir, Leicester Space Week. Roles and outcomes are blank until
you supply them.

## 3. Consolidation: URL map

| Current | Destination | Action |
| --- | --- | --- |
| `cv.rjmlaird.co.uk/` | `rjmlaird.co.uk/cv/` | 301 once `cv.json` has `"complete": true` |
| `cv.rjmlaird.co.uk/<other>` | `/cv/` or the matching section anchor | 301 to the closest equivalent, never blanket to `/` |
| `dev.rjmlaird.co.uk/` | `rjmlaird.co.uk/open-source/` | 301 |
| `dev.rjmlaird.co.uk/<project>` | `/open-source/` (or the repo URL) | 301 per page where a clear equivalent exists |
| `labs.rjmlaird.co.uk` | keep | Genuine tool site with its own audience; link from `/open-source/` |

The main site deploys via GitHub Pages (`CNAME`, `deploy.yml`), which cannot issue 301s. Redirects belong on the
**subdomain** hosts (Cloudflare Redirect Rules or the Worker serving them), which is where the old URLs live.

## 4. Staged checklist

1. **Prepare.** Export every live URL on the two subdomains (sitemap plus Search Console Pages report). Complete `src/data/cv.json`.
2. **Launch the destination.** Deploy `/cv/` and `/open-source/` with `complete: true`. Confirm they are indexable, in the sitemap, and have a self-referencing canonical.
3. **Redirect.** Add one-to-one 301s per the table. Test with `curl -I` for status, hop count and final URL.
4. **Canonicals.** Old pages should 301, not canonical, to the new ones. Do not leave both live.
5. **Internal links.** `profile.json` already points to `/cv/` and `/open-source/`. Search other repos (`greenorbit.space`, initiative sites, Substack, social bios, email signatures) for `cv.rjmlaird.co.uk` and `dev.rjmlaird.co.uk`.
6. **Sitemap.** Submit `sitemap-index.xml` for the main property. The build excludes `/cv/` until complete and excludes stub entries.
7. **Metadata.** `/cv/` emits `ProfilePage` JSON-LD with credentials. Add a real Open Graph image at `/images/og-default.jpg`, which the layout references but does not exist yet.
8. **Retire.** Keep the redirects for at least 12 months.

## 5. Monitoring after launch

- Search Console: add the subdomains as properties first; watch Pages, Redirect errors and Coverage for 4 to 8 weeks. Use the Change of Address tool only for domain moves, not subdomain consolidation.
- Check that the redirected URLs drop out of the index and `/cv/` and `/open-source/` gain impressions.
- Analytics: compare sessions to `/cv/` against the old subdomain; watch the `/contact/#...` anchors as the conversion paths.
- Re-run `npm run audit:content` monthly and publish case studies as they pass.

## 6. Facts to confirm before launch

- Tutoring for under-18s via parent, guardian or school, and the safeguarding line on `/teaching/`.
- Mentoring: confidentiality statement and "video call or in person in Leicester".
- Reply time ("within a few working days") on `/contact/`.
- The "not a current academic appointment" note on `/research/`.
- Credentials listed in `cv.json` (FRAS, AMAPM) and the HE Space role title and dates.
- `forms/contact.php` cannot run on GitHub Pages. The new `/contact/` uses mailto links and the cal.com link instead.
