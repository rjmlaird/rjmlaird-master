import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'researchProjects'>;
const order = { 'in-progress': 0, idea: 1, completed: 2, archived: 3 } as const;

export async function getProjects() {
  const all = await getCollection('researchProjects');
  return all.sort((a, b) => order[a.data.status] - order[b.data.status] || b.data.updatedAt.getTime() - a.data.updatedAt.getTime());
}
export async function getMethods() { return (await getCollection('researchMethods')).sort((a, b) => a.data.title.localeCompare(b.data.title)); }
export async function getNotebooks() { return (await getCollection('researchNotebooks')).sort((a, b) => b.data.updatedAt.getTime() - a.data.updatedAt.getTime()); }
export async function getNotes() { return (await getCollection('researchNotes')).sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime()); }

export const statusLabel: Record<Project['data']['status'], string> = {
  idea: 'Idea (not started)', 'in-progress': 'In progress', completed: 'Completed', archived: 'Archived',
};
export const fmt = (d?: Date) => d?.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) ?? '';
export const iso = (d: Date) => d.toISOString().slice(0, 10);
