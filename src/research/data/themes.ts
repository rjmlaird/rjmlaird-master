export const themes = [
  { slug: 'earth-observation', label: 'Earth observation', blurb: 'Satellite imagery and how it becomes an environmental measurement.' },
  { slug: 'astronomy', label: 'Astronomy and astrophysics', blurb: 'Observing workflows, night-sky data and citizen science.' },
  { slug: 'space-sustainability', label: 'Space sustainability', blurb: 'Orbital debris, dark and quiet skies, policy and operator responsibility.' },
  { slug: 'climate-data', label: 'Climate and environmental data', blurb: 'Climate datasets, visualisation and honest treatment of uncertainty.' },
  { slug: 'science-communication', label: 'Science communication', blurb: 'How explainers, visualisations and evidence trails support understanding.' },
  { slug: 'digital-research-systems', label: 'Digital research systems', blurb: 'APIs, data models and reproducible publishing workflows.' },
] as const;
export type ThemeSlug = (typeof themes)[number]['slug'];
export const themeLabel = (s: string) => themes.find((t) => t.slug === s)?.label ?? s;
