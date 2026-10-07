import { getCollection } from 'astro:content';
import type { Section } from './schemas';
import { url } from './urls';

export interface Entry {
  title: string;
  description: string;
  href: string;
  kind: 'doc' | 'site' | 'asset';
  status?: 'draft' | 'review' | 'stable';
}

export async function getSectionEntries(section: Section): Promise<Entry[]> {
  const docs = (await getCollection('brandDocs'))
    .filter((d) => d.id.startsWith(section + '/'))
    .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title))
    .map<Entry>((d) => ({
      title: d.data.title,
      description: d.data.description,
      href: url(d.id),
      kind: 'doc',
      status: d.data.status,
    }));

  if (section === 'sites') {
    const sites = (await getCollection('brandSites'))
      .sort((a, b) => a.data.order - b.data.order)
      .map<Entry>((s) => ({ title: s.data.name, description: s.data.purpose, href: url(`sites/${s.id}`), kind: 'site' }));
    return [...docs, ...sites];
  }
  if (section === 'assets') {
    const assets = (await getCollection('brandAssets')).map<Entry>((a) => ({
      title: a.data.title,
      description: `${a.data.type}, ${a.data.licence}`,
      href: url(`assets/${a.id}`),
      kind: 'asset',
    }));
    return [...docs, ...assets];
  }
  return docs;
}
