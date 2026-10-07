import type { Section } from '@brand/lib/schemas';

export const sectionMeta: Record<Section, { title: string; summary: string }> = {
  foundations: { title: 'Foundations', summary: 'Principles, personality and how the sites fit together.' },
  identity: { title: 'Identity', summary: 'Logo, colour, typography and imagery.' },
  voice: { title: 'Voice', summary: 'Tone, writing style and science communication.' },
  components: { title: 'Components', summary: 'Reusable patterns for pages, cards, links and images.' },
  tokens: { title: 'Tokens', summary: 'Colour, type and spacing values, with CSS and JSON output.' },
  assets: { title: 'Assets', summary: 'Approved media, usage rules and delivery guidance.' },
  sites: { title: 'Sites', summary: 'Purpose, audience and visual variation for each site.' },
  governance: { title: 'Governance', summary: 'Approval, licensing and versioning.' },
};

export const principles: [string, string][] = [
  ['Clear', 'Complex ideas should become easier to understand.'],
  ['Evidence-led', 'Science, data and claims are presented responsibly.'],
  ['Useful', 'Design helps people find, understand and act.'],
  ['Accessible', 'Every site works for a broad range of people and devices.'],
  ['Connected', 'Each site has its own purpose but is recognisably part of one ecosystem.'],
];
