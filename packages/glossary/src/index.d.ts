export type GlossaryTerm = {
  term: string;
  slug: string;
  short?: string;
  aliases?: string[];
  category?: string;
  /** Always `https://glossary.rjmlaird.co.uk/{slug}/` */
  url: string;
};

export type RemarkGlossaryOptions = {
  /** Throw on unknown references (default true). When false, warn and leave them unchanged. */
  strict?: boolean;
  /** Term list to resolve against (default: the bundled manifest). */
  terms?: GlossaryTerm[];
  /** Class added to generated links (default "glossary-link"). */
  className?: string;
};

export const glossaryBaseUrl: string;
export const glossaryTerms: GlossaryTerm[];
export function isValidSlug(slug: unknown): slug is string;
export function glossaryUrl(slug: string): string;
export function normaliseKey(value: string): string;
export function validateTerms(terms: unknown): string[];
export function createIndex(terms: GlossaryTerm[]): Map<string, GlossaryTerm>;
export function resolveGlossaryTerm(reference: string, terms?: GlossaryTerm[]): GlossaryTerm | undefined;
export function suggestTerm(reference: string, terms: GlossaryTerm[]): GlossaryTerm | undefined;
export function editDistance(a: string, b: string): number;
export function remarkGlossaryLinks(options?: RemarkGlossaryOptions): (tree: unknown, file?: unknown) => void;
