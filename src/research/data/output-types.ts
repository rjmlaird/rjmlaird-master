export const outputTypes = [
  { type: 'publication', slug: 'publications', label: 'Publications' },
  { type: 'preprint', slug: 'preprints', label: 'Preprints' },
  { type: 'poster', slug: 'posters', label: 'Posters' },
  { type: 'presentation', slug: 'presentations', label: 'Presentations' },
  { type: 'report', slug: 'reports', label: 'Reports' },
  { type: 'dataset', slug: 'datasets', label: 'Datasets' },
  { type: 'software', slug: 'software', label: 'Software and repositories' },
  { type: 'visualisation', slug: 'visualisations', label: 'Visualisations' },
  { type: 'notebook', slug: 'notebooks', label: 'Notebooks' },
] as const;
export const outputTypeLabel = (t: string) => outputTypes.find((o) => o.type === t)?.label ?? t;
