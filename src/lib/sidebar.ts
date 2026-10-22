// src/lib/sidebar.ts
// Types and normalisers for EntrySidebar. The page-facing sidebars
// (Project / Video / Podcast) only translate their props into sections;
// all markup, styling and link rules live in EntrySidebar.
import { entryHref, cvHref, sectorHref, type EntryKind } from "./routes";
import { getYouTubeId, youTubeWatchUrl } from "../utils/youtube";

export interface SidebarLink {
  label: string;
  /** Omitted when the item has nowhere sensible to go; rendered as plain text. */
  href?: string;
  external?: boolean;
}

export interface SidebarGroup {
  title?: string;
  items: SidebarLink[];
}

export interface SidebarSection {
  title: string;
  /** list = bullets, chips = pill tags, links = outbound link list, lines = address-style block */
  variant?: "list" | "chips" | "links" | "lines";
  items?: SidebarLink[];
  /** Sub-grouped items (e.g. Organiser / Speakers under "Event details") */
  groups?: SidebarGroup[];
  text?: string;
  image?: { src: string; alt: string; width?: number; height?: number };
}

type Loose = any;

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const first = (...values: unknown[]) => values.map(text).find(Boolean) ?? "";

/** Drop sections that would render empty. */
export const compact = (sections: (SidebarSection | false | null | undefined)[]) =>
  sections.filter((s): s is SidebarSection => {
    if (!s) return false;
    return Boolean(
      s.text || s.image || s.items?.length || s.groups?.some((g) => g.items.length),
    );
  });

export const plain = (values: Loose[] = []): SidebarLink[] =>
  values
    .map((v) => (typeof v === "string" ? v : first(v?.name, v?.title, v?.label)))
    .filter(Boolean)
    .map((label) => ({ label }));

export const sectorLinks = (values: Loose[] = []): SidebarLink[] =>
  plain(values).map((item) => ({ ...item, href: sectorHref(item.label) }));

/** Internal collection entry (CollectionEntry or a loose {slug|id,title} object). */
export function entryLink(item: Loose, kind: EntryKind, fallback: string): SidebarLink {
  const label = first(item?.data?.title, item?.title, item?.name) || fallback;
  const id = first(item?.id, item?.slug, item?.data?.slug);
  const url = first(item?.url, item?.href);
  return id ? { label, href: entryHref(kind, id) } : url ? { label, href: url } : { label };
}

/** CV-backed record (experience, education, awards...). */
export function cvLink(item: Loose, labelKeys: string[], fallback: string, linkToCvRoot = false): SidebarLink {
  const label = first(...labelKeys.map((k) => item?.[k]), item?.title, item?.name) || fallback;
  const id = first(item?.id);
  if (id) return { label, href: cvHref(id), external: true };
  const url = first(item?.url, item?.website, item?.href);
  if (url) return { label, href: url, external: true };
  return linkToCvRoot ? { label, href: cvHref(), external: true } : { label };
}

export function videoLink(item: Loose): SidebarLink {
  const label = first(item?.title, item?.data?.title, item?.name) || "Video";
  const id = getYouTubeId(first(item?.youtubeId, item?.data?.youtubeId));
  const href = first(item?.url, item?.data?.url) || (id ? youTubeWatchUrl(id) : "");
  return href ? { label, href, external: true } : { label };
}

export function organisationLink(item: Loose, fallback: string): SidebarLink {
  if (typeof item === "string") return { label: item };
  const label = first(item?.name, item?.organisation) || fallback;
  const href = first(item?.website, item?.url);
  return href ? { label, href, external: true } : { label };
}

const LINK_LABELS: Record<string, string> = {
  github: "GitHub",
  web: "Website",
  demo: "Demo",
  docs: "Docs",
  youtube: "YouTube",
  store: "Store",
  api: "API",
  eventPage: "Event page",
  meetup: "Meetup",
  luMa: "Lu.ma",
};

export function outboundLinks(links: Record<string, unknown> = {}, labels = LINK_LABELS): SidebarLink[] {
  return Object.entries(links)
    .filter(([, url]) => text(url))
    .map(([key, url]) => ({
      label: labels[key] ?? key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase()),
      href: text(url),
      external: true,
    }));
}

export const formatLabel = (format?: string) =>
  ({ "in-person": "In person", online: "Online", hybrid: "Hybrid" } as Record<string, string>)[format ?? ""] ?? format ?? "";
