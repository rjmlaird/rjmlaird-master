import { parseBibtex, cleanTex, parseName, splitAuthors } from './bibtex';
import {
  AUTHOR_MATCH, CDN_BASE, DELIVERY_ENTITIES, EXCLUDED_CREDENTIAL_TYPES, IGNORED_TAGS, LANGUAGE_CODES,
  PERSON, SAME_AS_CATEGORIES, SAME_AS_DENY, SITE_URL, TALK_PUBLISH_STATUSES,
} from './config';
import type { SchemaGraph } from './graph';
import {
  absoluteUrl, cleanUrl, compact, countryCode, defined, isFuture, isoDate, nodeId, uniq, youtubeId,
} from './helpers';
import type {
  AwardItem, BibEntry, CaseStudyItem, CredentialItem, EducationItem, JsonLd, LanguageItem,
  MembershipGroup, ServiceItem, SkillsTaxonomy, SocialItem, TalkItem, VideoItem, VolunteeringItem,
} from './types';

/* ───────────────────────── Profile ───────────────────────── */

export function mapProfile(g: SchemaGraph): void {
  g.addToPerson({
    givenName: PERSON.givenName,
    familyName: PERSON.familyName,
    alternateName: PERSON.alternateName,
    jobTitle: PERSON.jobTitle,
    description: PERSON.description,
    address: { '@type': 'PostalAddress', addressLocality: PERSON.locality, addressCountry: PERSON.country },
    worksFor: g.org(PERSON.worksForSlug),
  });
}

/* ─────────────── Certifications & credentials ─────────────── */

const CATEGORY: Record<string, string> = {
  'Industry Certification': 'certification',
  Certificate: 'certificate',
  Badge: 'badge',
  CPD: 'continuing professional development',
  Transcript: 'transcript',
};
const DEGREE_RE = /\b(MPhys|MSc|BSc|PhD)\b/;

export function mapCredentials(g: SchemaGraph, items: CredentialItem[]): void {
  const creds = items
    .filter((c) => !EXCLUDED_CREDENTIAL_TYPES.has(c.type))
    .map((c) =>
      compact({
        '@type': 'EducationalOccupationalCredential',
        '@id': nodeId('credential', c.id),
        name: c.name,
        credentialCategory: DEGREE_RE.test(c.name) ? 'degree' : (CATEGORY[c.type] ?? c.type.toLowerCase()),
        recognizedBy: g.org(c.organisationSlug),
        identifier: c.cdnId,
        url: CDN_BASE && c.cdnId ? `${CDN_BASE}/${c.cdnId}` : undefined,
      }),
    );
  g.addToPerson({ hasCredential: defined(creds) });
}
export const mapCertifications = mapCredentials;

/* ───────────────────────── Awards ───────────────────────── */

const GRANT_TYPES = new Set(['grant', 'scholarship', 'fellowship']);
const CURRENCY: Record<string, string> = { '€': 'EUR', '£': 'GBP', $: 'USD' };

function parseAmount(v?: string): JsonLd | undefined {
  const m = /^([€£$])\s?([\d,.]+)/.exec(v?.trim() ?? '');
  if (!m) return undefined;
  return { '@type': 'MonetaryAmount', currency: CURRENCY[m[1]], value: Number(m[2].replace(/,/g, '')) };
}

function awardText(g: SchemaGraph, a: AwardItem): string {
  const head = [a.title, a.award].filter(Boolean).join(', ');
  const forProject = a.project ? ` for ${a.project}` : '';
  const cat = a.category ? ` (${a.category})` : '';
  const tail = [g.orgName(a.organisationSlug), a.year].filter(Boolean).join(', ');
  return `${head}${forProject}${cat} — ${tail}`;
}

function grantNode(g: SchemaGraph, a: AwardItem): JsonLd | undefined {
  const amount = parseAmount(a.value);
  const detail = a.programme ?? a.instrument;
  return compact({
    '@type': amount ? 'MonetaryGrant' : 'Grant',
    '@id': nodeId('grant', a.id),
    name: detail ? `${a.title}: ${detail}` : a.title,
    description: [
      a.year ? `Awarded in ${a.year}.` : undefined,
      a.summary,
      a.duration ? `Duration: ${a.duration}.` : undefined,
      a.event ? `Event: ${a.event}.` : undefined,
      a.location,
    ].filter(Boolean).join(' '),
    funder: g.orgs([a.organisationSlug, ...(a.additionalOrganisationSlugs ?? [])]),
    amount,
  });
}

function speakerEvent(g: SchemaGraph, a: AwardItem): JsonLd | undefined {
  const organizer = g.org(a.organisationSlug);
  const startDate = a.year ? String(a.year) : undefined;
  const location = a.location ? { '@type': 'Place', name: a.location } : undefined;
  return compact({
    '@type': 'Event',
    '@id': nodeId('event', a.id),
    name: a.session_title ?? a.event ?? a.title,
    description: a.session_title ? `${a.title} — ${a.event ?? ''}` : a.summary,
    startDate,
    location,
    organizer,
    performer: g.personRef,
    keywords: a.keywords?.join(', '),
    superEvent: a.session_title && a.event ? { '@type': 'Event', name: a.event, startDate, organizer } : undefined,
  });
}

/**
 * Schema.org has no `Award` type: `award` is a plain-text property. So:
 *  - grants / scholarships / fellowships → Person.funding (Grant / MonetaryGrant)
 *  - speaking invitations                → Person.performerIn (Event)
 *  - everything else                     → Person.award (descriptive text)
 */
export function mapAwards(g: SchemaGraph, items: AwardItem[]): void {
  const award: string[] = [];
  const funding: (JsonLd | undefined)[] = [];
  const performerIn: (JsonLd | undefined)[] = [];
  for (const a of items) {
    const type = a.type.toLowerCase();
    if (GRANT_TYPES.has(type)) funding.push(grantNode(g, a));
    else if (type === 'speaker invitation' && (a.event || a.session_title)) performerIn.push(speakerEvent(g, a));
    else award.push(awardText(g, a));
  }
  g.addToPerson({ award, funding: defined(funding), performerIn: defined(performerIn) });
}

/* ───────────── Education, volunteering, memberships ───────────── */

export function mapEducation(g: SchemaGraph, items: EducationItem[]): void {
  const roles = items.map((e) => {
    const awarding = e.awardingBodySlug ? `Awarded by ${g.orgName(e.awardingBodySlug)}.` : undefined;
    return compact({
      '@type': 'OrganizationRole',
      '@id': nodeId('education', e.id),
      roleName: e.qualification ?? e.role,
      startDate: isoDate(e.startDate),
      endDate: e.current ? undefined : isoDate(e.endDate),
      description: [e.summary, awarding].filter(Boolean).join(' '),
      alumniOf: g.org(e.organisationSlug),
    });
  });
  g.addToPerson({ alumniOf: defined(roles) });
}

export function mapVolunteering(g: SchemaGraph, items: VolunteeringItem[]): void {
  const roles = items.map((v) => {
    const place = [v.city, countryCode(v.country)].filter(Boolean).join(', ');
    return compact({
      '@type': 'OrganizationRole',
      '@id': nodeId('volunteering', v.id),
      roleName: v.role,
      startDate: isoDate(v.startDate),
      endDate: v.current ? undefined : isoDate(v.endDate),
      description: [v.event, v.summary, place].filter(Boolean).join(' · '),
      memberOf: g.org(v.organisationSlug),
    });
  });
  g.addToPerson({ memberOf: defined(roles) });
}

export function mapMemberships(g: SchemaGraph, groups: MembershipGroup[]): void {
  const roles = groups.flatMap((grp) =>
    grp.items.map((m) =>
      compact({
        '@type': 'OrganizationRole',
        roleName: m.role,
        memberOf: g.org(m.organisationSlug),
      }),
    ),
  );
  g.addToPerson({ memberOf: defined(roles) });
}

/* ─────────────── Skills, languages, services, socials ─────────────── */

const DEFAULT_SKILL_SECTIONS = ['domain_expertise', 'practices', 'areas_of_interest'];

function collectSkills(node: unknown, out: string[]): void {
  if (Array.isArray(node)) return node.forEach((n) => collectSkills(n, out));
  if (!node || typeof node !== 'object') return;
  const o = node as Record<string, unknown>;
  const hasChildren = Array.isArray(o.skills) || Array.isArray(o.subcategories);
  if (Array.isArray(o.skills)) out.push(...(o.skills as string[]));
  if (Array.isArray(o.subcategories)) collectSkills(o.subcategories, out);
  if (!hasChildren && typeof o.label === 'string') out.push(o.label);
}

/** `sections` choices: domain_expertise, technical_skills, practices, leadership_and_collaboration, areas_of_interest */
export function mapSkills(g: SchemaGraph, data: SkillsTaxonomy, sections: string[] = DEFAULT_SKILL_SECTIONS): void {
  const tax = (data.taxonomy ?? data) as Record<string, unknown>;
  const out: string[] = [];
  for (const s of sections) collectSkills(tax[s], out);
  g.addToPerson({ knowsAbout: uniq(out) });
}

export function mapLanguages(g: SchemaGraph, items: readonly LanguageItem[]): void {
  g.addToPerson({
    knowsLanguage: items.map((l) =>
      compact({ '@type': 'Language', name: l.name, alternateName: LANGUAGE_CODES[l.name.toLowerCase()] }),
    ),
  });
}

function deliveryProvider(g: SchemaGraph, name?: string): JsonLd {
  if (!name) return g.personRef;
  const key = name.toLowerCase().replace(/\.$/, '').trim();
  const slug = DELIVERY_ENTITIES[key] ?? g.findOrg(name)?.slug;
  return g.org(slug) ?? g.personRef;
}

export function mapServices(g: SchemaGraph, items: ServiceItem[]): void {
  const offers = items.map((s) =>
    compact({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        '@id': nodeId('service', s.id),
        name: s.title,
        serviceType: s.title,
        description: s.summary ?? s.list?.join('; '),
        audience: s.targetAudience?.map((a) => ({ '@type': 'Audience', audienceType: a })),
        provider: deliveryProvider(g, s.deliveryEntity),
      },
    }),
  );
  g.addToPerson({ makesOffer: defined(offers) });
}

export function mapSocials(g: SchemaGraph, items: SocialItem[], categories: Set<string> = SAME_AS_CATEGORIES): void {
  const hasX = items.some((s) => s.key === 'x' && s.status === 'active');
  const host = new URL(SITE_URL).host;
  const urls = items
    .filter((s) => s.status === 'active' && s.category && categories.has(s.category))
    .filter((s) => !(s.key === 'twitter' && hasX))
    .map((s) => cleanUrl(s.url))
    .filter((u): u is string => !!u && !SAME_AS_DENY.test(u) && !u.includes(host));
  g.addToPerson({ sameAs: uniq(urls) });
}

/* ───────────────── Case studies, videos, talks ───────────────── */

const PLACEHOLDER_TEXT = /^(a short summary|a slightly longer excerpt)/i;
const PLACEHOLDER_URL = /example\.com|yourname/i;
const realTags = (tags?: string[]) => tags?.filter((t) => !IGNORED_TAGS.has(t.toLowerCase()));

export function mapCaseStudies(g: SchemaGraph, items: CaseStudyItem[]): void {
  for (const c of items) {
    if (c.draft) continue;
    const description = [c.description, c.excerpt].find((d) => d && !PLACEHOLDER_TEXT.test(d));
    const link = [c.links?.web, c.links?.live].find((u) => u && !PLACEHOLDER_URL.test(u));
    const funder = g.org(c.clientOrganisationSlug);
    if (!description && !link && !funder) continue; // nothing real to say
    const start = isoDate(c.startDate);
    g.addNode(
      compact({
        '@type': 'CreativeWork',
        '@id': nodeId('casestudy', c.slug),
        name: c.title,
        description,
        url: cleanUrl(link),
        dateCreated: start && !isFuture(start) ? start : undefined,
        image: absoluteUrl(c.heroImage ?? c.image),
        keywords: realTags(c.tags)?.join(', '),
        contributor: g.personRef,
        funder,
      }),
    );
  }
}

function producerFromCredit(g: SchemaGraph, credit?: string): JsonLd | undefined {
  if (!credit) return undefined;
  const cut = Math.max(credit.lastIndexOf(': ') + 2, credit.toLowerCase().lastIndexOf(' by ') + 4);
  const o = g.findOrgInText(cut > 3 ? credit.slice(cut) : credit);
  return o ? g.org(o.slug) : undefined;
}

export function mapVideos(g: SchemaGraph, items: VideoItem[]): void {
  for (const v of items) {
    const yt = youtubeId(v.youtubeId);
    g.addNode(
      compact({
        '@type': 'VideoObject',
        '@id': nodeId('video', v.slug),
        name: v.title,
        description: [v.summary, v.description].filter(Boolean).join(' '),
        thumbnailUrl: absoluteUrl(v.heroImage),
        uploadDate: isoDate(v.publishedDate),
        url: yt ? `https://www.youtube.com/watch?v=${yt}` : cleanUrl(v.url),
        embedUrl: yt ? `https://www.youtube.com/embed/${yt}` : undefined,
        genre: v.video_type,
        keywords: realTags(v.tags)?.join(', '),
        producer: producerFromCredit(g, v.production_credit),
        funder: g.orgFromText(v.client),
        contributor: g.personRef,
        isPartOf: v.relatedCaseStudies?.map((s) => ({ '@id': nodeId('casestudy', s) })),
      }),
    );
  }
}

export function mapTalks(g: SchemaGraph, items: TalkItem[], statuses: Set<string> = TALK_PUBLISH_STATUSES): void {
  const events: (JsonLd | undefined)[] = [];
  for (const t of items) {
    if (!t.status || !statuses.has(t.status)) continue;
    const docId = nodeId('talk', t.id);
    g.addNode(
      compact({
        '@type': 'PresentationDigitalDocument',
        '@id': docId,
        name: t.title,
        description: t.summary,
        abstract: t.key_points?.join(' · '),
        author: g.personRef,
        keywords: t.tags?.join(', '),
        educationalLevel: t.level,
        genre: t.format ?? t.type,
        timeRequired: t.duration_minutes ? `PT${t.duration_minutes}M` : undefined,
        audience: t.audience?.map((a) => ({ '@type': 'Audience', audienceType: a })),
        isPartOf: t.series ? { '@type': 'CreativeWorkSeries', name: t.series } : undefined,
        url: cleanUrl(t.assets?.slides),
      }),
    );
    const date = isoDate(t.date);
    if (date) {
      events.push(
        compact({
          '@type': 'Event',
          '@id': nodeId('event', t.id),
          name: t.title,
          startDate: date,
          location: t.location ? { '@type': 'Place', name: t.location } : undefined,
          performer: g.personRef,
          workPerformed: { '@id': docId },
        }),
      );
    }
  }
  g.addToPerson({ performerIn: defined(events) });
}

/* ───────────────────────── Publications ───────────────────────── */

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const PUB_TYPE: Record<string, string> = {
  article: 'ScholarlyArticle',
  inproceedings: 'ScholarlyArticle',
  conference: 'ScholarlyArticle',
  techreport: 'Report',
  misc: 'CreativeWork',
};

function pubDate(year?: string, month?: string): string | undefined {
  if (!year) return undefined;
  const m = month ? MONTHS.indexOf(month.toLowerCase().slice(0, 3)) + 1 || Number(month) : 0;
  return m >= 1 && m <= 12 ? `${year}-${String(m).padStart(2, '0')}` : year;
}

function publicationNode(g: SchemaGraph, e: BibEntry, includeAbstract: boolean): JsonLd | undefined {
  const f = e.fields;
  const title = cleanTex(f.title);
  if (!title) return undefined;
  const authors = splitAuthors(f.author ?? '').map((raw) => {
    const n = parseName(raw);
    if (!n.corporate && n.family?.toLowerCase() === AUTHOR_MATCH.family && n.given?.toLowerCase().startsWith(AUTHOR_MATCH.givenInitial))
      return g.personRef;
    return n.corporate
      ? { '@type': 'Organization', name: n.full }
      : { '@type': 'Person', name: n.full, givenName: n.given, familyName: n.family };
  });
  let part: JsonLd | undefined = f.journal ? { '@type': 'Periodical', name: cleanTex(f.journal), issn: f.issn } : undefined;
  if (f.volume) part = { '@type': 'PublicationVolume', volumeNumber: f.volume, isPartOf: part };
  if (f.number && f.journal) part = { '@type': 'PublicationIssue', issueNumber: f.number, isPartOf: part };
  if (!f.journal && f.booktitle) part = { '@type': 'CreativeWork', name: cleanTex(f.booktitle) };
  const [pageStart, pageEnd] = (f.pages ?? '').split(/--|–|-/).map((p) => p.trim());
  const arxiv = /arxiv:\s*([\w./-]+)/i.exec(f.note ?? '')?.[1];
  const type = PUB_TYPE[e.type] ?? 'CreativeWork';
  const doiUrl = f.doi ? `https://doi.org/${f.doi}` : undefined;
  return compact({
    '@type': type,
    '@id': nodeId('publication', e.key),
    name: title,
    author: authors,
    datePublished: pubDate(f.year, f.month),
    isPartOf: part,
    publisher: f.institution ? { '@type': 'Organization', name: cleanTex(f.institution) } : undefined,
    pageStart: type === 'ScholarlyArticle' ? pageStart : undefined,
    pageEnd: type === 'ScholarlyArticle' ? pageEnd : undefined,
    url: doiUrl ?? cleanUrl(f.url),
    identifier: f.doi ? { '@type': 'PropertyValue', propertyID: 'doi', value: f.doi } : undefined,
    sameAs: uniq(defined([doiUrl, arxiv ? `https://arxiv.org/abs/${arxiv}` : undefined])),
    abstract: includeAbstract ? cleanTex(f.abstract) : undefined,
  });
}

/** Accepts raw BibTeX text (your publications.json is BibTeX, not JSON) or pre-parsed entries. */
export function mapPublications(g: SchemaGraph, input: string | BibEntry[], opts: { includeAbstract?: boolean } = {}): void {
  const entries = typeof input === 'string' ? parseBibtex(input) : input;
  for (const e of entries) g.addNode(publicationNode(g, e, opts.includeAbstract ?? false));
}
