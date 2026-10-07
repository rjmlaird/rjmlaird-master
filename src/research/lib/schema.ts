import { site } from '../data/site';
import { external } from '../data/external-links';

const abs = (path: string) => new URL(path, site.url).href;

export const websiteSchema = () => ({ '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url, description: site.description });
export const personSchema = () => ({
  '@context': 'https://schema.org', '@type': 'Person', name: 'Ryan Laird', url: external.main.url,
  jobTitle: 'Science communicator and digital practitioner',
  knowsAbout: ['Astrophysics', 'Earth observation', 'Climate data', 'Space sustainability', 'Science communication'],
  sameAs: [external.main.url, external.astro.url, external.space.url],
});
export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(it.path) })),
});
export const projectSchema = (o: { title: string; summary: string; path: string; keywords: string[]; modified: Date; started?: Date }) => ({
  '@context': 'https://schema.org', '@type': 'CreativeWork', name: o.title, description: o.summary, url: abs(o.path),
  author: { '@type': 'Person', name: 'Ryan Laird', url: external.main.url },
  keywords: o.keywords.join(', '), dateModified: o.modified.toISOString().slice(0, 10),
  ...(o.started ? { dateCreated: o.started.toISOString().slice(0, 10) } : {}),
});
