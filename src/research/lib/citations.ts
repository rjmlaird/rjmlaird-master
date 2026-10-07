import type { Project } from './content';
import { site } from '../data/site';

/** Suggested citation. Uses the project's own `citation` if provided. */
export function projectCitation(p: Project): string {
  if (p.data.citation) return p.data.citation;
  const year = p.data.updatedAt.getUTCFullYear();
  return `Laird, R. (${year}). ${p.data.title}. Independent research project. ${site.url}/research/projects/${p.id}/`;
}
