import { PERSON, PERSON_ID, SITE_URL } from './config';
import { absoluteUrl, cleanUrl, compact, nodeId, titleCaseSlug, uniq } from './helpers';
import { defaultOrganisations, normaliseOrganisations } from './registry';
import type { JsonLd, Organisation } from './types';

const KIND_TO_TYPE: Record<string, string> = {
  university: 'CollegeOrUniversity',
  college: 'EducationalOrganization',
  school: 'School',
  training_provider: 'EducationalOrganization',
  education_provider: 'EducationalOrganization',
  space_agency: 'GovernmentOrganization',
  government: 'GovernmentOrganization',
  local_authority: 'GovernmentOrganization',
  ngo_charity: 'NGO',
  research_centre: 'ResearchOrganization',
  observatory: 'ResearchOrganization',
};

export function orgToNode(o: Organisation): JsonLd {
  const alt = uniq([o.shortName, ...(o.aliases ?? [])].filter((a): a is string => !!a && a !== o.name));
  return (
    compact({
      '@type': KIND_TO_TYPE[o.kind] ?? 'Organization',
      '@id': nodeId('org', o.slug),
      name: o.name,
      alternateName: alt,
      description: o.shortDescription ?? o.description,
      url: cleanUrl(o.url),
      logo: absoluteUrl(o.logo),
    }) ?? {}
  );
}

/**
 * Collects nodes for one JSON-LD @graph. Organisations are registered by slug as they are
 * referenced, then emitted once each; everything else points at them via { "@id": ... }.
 */
export class SchemaGraph {
  readonly personRef: JsonLd = { '@id': PERSON_ID };
  readonly person: JsonLd = { '@type': 'Person', '@id': PERSON_ID, name: PERSON.name, url: SITE_URL };

  private readonly registry = new Map<string, Organisation>();
  private readonly legacy = new Map<string, string>();
  private readonly used = new Set<string>();
  private readonly nodes = new Map<string, JsonLd>();

  constructor(organisations?: Organisation[]) {
    const orgs = organisations ? normaliseOrganisations(organisations) : defaultOrganisations;
    for (const o of orgs) {
      this.registry.set(o.slug, o);
      for (const l of o.legacySlugs ?? []) this.legacy.set(l, o.slug);
    }
  }

  resolve(slug?: string): Organisation | undefined {
    if (!slug) return undefined;
    return this.registry.get(slug) ?? this.registry.get(this.legacy.get(slug) ?? '');
  }

  /** Reference to an organisation by slug; registers it for emission. */
  org(slug?: string): JsonLd | undefined {
    if (!slug) return undefined;
    const o = this.resolve(slug);
    if (!o) {
      console.warn(`[schema] organisation slug "${slug}" not found in organisations.json`);
      return { '@type': 'Organization', name: titleCaseSlug(slug) };
    }
    this.used.add(o.slug);
    return { '@id': nodeId('org', o.slug) };
  }

  orgs(slugs: (string | undefined)[]): JsonLd[] {
    return slugs.map((s) => this.org(s)).filter((v): v is JsonLd => !!v);
  }

  orgName(slug?: string): string | undefined {
    return this.resolve(slug)?.name ?? (slug ? titleCaseSlug(slug) : undefined);
  }

  /** Finds an organisation by exact name/short name/alias, then by contained name. */
  findOrg(text?: string): Organisation | undefined {
    if (!text) return undefined;
    const t = text.trim().toLowerCase();
    const all = [...this.registry.values()];
    const names = (o: Organisation) => [o.name, o.shortName, ...(o.aliases ?? [])].filter((n): n is string => !!n).map((n) => n.toLowerCase());
    return (
      all.find((o) => names(o).includes(t)) ??
      all
        .filter((o) => names(o).some((n) => n.length >= 5 && t.includes(n)))
        .sort((a, b) => b.name.length - a.name.length)[0]
    );
  }

  /** Ref for free text: a registered org if recognised, otherwise an inline Organization. */
  orgFromText(text?: string): JsonLd | undefined {
    if (!text) return undefined;
    const o = this.findOrg(text);
    return o ? this.org(o.slug) : { '@type': 'Organization', name: text };
  }

  /** Earliest-mentioned registered organisation within a longer string. */
  findOrgInText(text?: string): Organisation | undefined {
    if (!text) return undefined;
    const t = text.toLowerCase();
    let best: { o: Organisation; at: number } | undefined;
    for (const o of this.registry.values()) {
      for (const n of [o.name, ...(o.aliases ?? [])]) {
        if (n.length < 5) continue;
        const at = t.indexOf(n.toLowerCase());
        if (at >= 0 && (!best || at < best.at)) best = { o, at };
      }
    }
    return best?.o;
  }

  addToPerson(props: JsonLd): void {
    for (const [k, v] of Object.entries(props)) {
      if (v === undefined || v === null) continue;
      const cur = this.person[k];
      if (Array.isArray(v)) {
        if (!v.length) continue;
        this.person[k] = [...(Array.isArray(cur) ? cur : cur !== undefined ? [cur] : []), ...v];
      } else {
        this.person[k] = v;
      }
    }
  }

  addNode(node: JsonLd | undefined): void {
    const id = node?.['@id'];
    if (node && typeof id === 'string') this.nodes.set(id, node);
  }

  toJSON(): JsonLd {
    const orgNodes = [...this.used].map((s) => orgToNode(this.registry.get(s)!));
    return (
      compact({
        '@context': 'https://schema.org',
        '@graph': [this.person, ...this.nodes.values(), ...orgNodes],
      }) ?? {}
    );
  }
}
