# Components audit

Verified on the full repo: `astro check` 0 errors, `astro build` 460 pages. Only `src/components`, plus the small shared helpers they now depend on, were changed. Pages and layouts are untouched.

## Removed (15 files, no importers anywhere in src, scripts, content or MDX)
About/SocialLinks, DataTable, Education/TalksTimeline (empty file), Education/TeachingCard, Hero/Hero, Hero/Credentials, Hero/OrbitGraphic, Initiatives/InitiativeCard, MetaTags (Head.astro owns SEO), Publications/BlogCard, Publications/BlogList, Quote (QuoteBlock is the used one), Socials (Footer renders socials), Story/Timeline, Story/TimelineItem. Also macOS .DS_Store files.

## Kept but orphaned: components/legal/* (11 files)
Nothing in this snapshot imports them. They belong to the legal-notice system (layouts/LegalNotice, lib/notice.ts, data/legal.ts, scripts/migrate-notices.py), but no /privacy/, /terms-of-use/ or /disclaimer/ pages exist in src/pages, while the Footer links to all three. Either add those pages or delete that whole set together.

## Unified
| Before | After |
|---|---|
| ProjectSidebar (624 lines), VideoSidebar (363), PodcastSidebar (202): three copies of the same markup, with `href="#"` fallbacks | `Sidebar/EntrySidebar` + `SidebarItems` render everything; the three sidebars are 80-130 line adapters with unchanged props |
| PostMeta, ProjectMeta, VideoMeta, PodcastMeta: four copies of date formatting, taxonomy rows and CSS | `EntryMeta`; the four are thin adapters with unchanged props |
| Hrefs hard-coded in 8 components | `lib/routes.ts` (one source of truth) |
| `getYouTubeId` copied 3 times (different regexes) | `utils/youtube.ts` |
| Date formatting copied in 5 places | `utils/date.ts` |
| Local `.sr-only` copies | the global one |

## Bugs fixed on the way
- RelatedPosts linked to `/blog/x` and `/projects/x`; neither route exists. Now `/insights/blog/x/` and `/work/projects/x/`.
- Video sidebar linked to `/projects/`, `/events/`, `/videos/`, `/experience/`, `/education/`; Project sidebar linked sectors to `/sectors/`; Podcast sidebar linked to `/podcasts/` and `/categories/`. All now use real routes.
- PodcastLayout nested an `<aside>` inside an `<aside>`; the sidebar now renders a `div` there.
- `.sidebar-block`, `.chip-list`, `.bullet-list` and `.link-list` had no styles anywhere, so those sidebars were unstyled. EntrySidebar styles them with the brand tokens.
- Checklist ticks used light-theme hex colours on a dark site; CategoryBadge hover used white on teal; YouTubeEmbed used undefined tokens. All now use design tokens.
- Dead `href="#"` links are now plain text; outbound links say "(opens in new tab)".
- Meta separators are CSS, not text, so screen readers do not read them out.

## Not changed (outside "components only"), but worth doing next
- `pages/category/[category]`, `pages/tags/[tag]`, `pages/insights/sectors/[sector]`: hard-coded `/projects/${id}/` and `/events/${id}/` links (about 50 broken links in the built site). Swap for `entryHref()` from `lib/routes.ts`.
- `layouts/VideoLayout` uses undefined `--color-surface-muted` and `--color-surface-subtle`.
- `layouts/ProjectLayout` breadcrumb uses `/events/`; the real route is `/work/events/`. The ProjectLayout I sent earlier copied that path, so use `entryHref`/`listHref("event")` there too.
- Still duplicated: PostCard / ProjectCard / PodcastCard share one structure, and the `.pr .pub` row cards (VideosCard, ArticlesCard, PublicationsCard, dev/ProjectsCard) share another. Each pair deserves its own `EntryCard` / `RowCard`; I left that for a visual-diff pass.
- `dev/ProjectsCard` has unused `status` and `statusLabel` variables; `Head.astro:207` has an unused `media`.
