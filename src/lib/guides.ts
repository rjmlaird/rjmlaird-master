// Shared helpers for the mentoring and coaching guide sections.
import { getCollection, type CollectionEntry } from "astro:content";
import mentoringNav from "../data/guides/mentoring.json";
import coachingNav from "../data/guides/coaching.json";

export type GuideName = "mentoring" | "coaching";
export type NavItem = { label: string; href?: string; children?: NavItem[] };
export type GuideNav = { title: string; hub: string; base: string; nav: NavItem[] };

export const guideNavs: Record<GuideName, GuideNav> = {
  mentoring: mentoringNav as GuideNav,
  coaching: coachingNav as GuideNav,
};

/** docs/index.md is the section home. Mentoring already has a hub at /mentoring/, so its home is /mentoring/specialist/. */
export function slugFor(name: GuideName, id: string): string | undefined {
  if (id === "index") return name === "mentoring" ? "specialist" : undefined;
  return id;
}

export async function guidePaths(name: GuideName) {
  const entries = (await getCollection(name)) as CollectionEntry<GuideName>[];
  return entries.map((entry) => ({
    params: { slug: slugFor(name, entry.id) },
    props: { entry, name },
  }));
}
