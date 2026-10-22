export { glossaryBaseUrl, glossaryUrl, isValidSlug } from './url.js';
export { glossaryTerms } from './terms.js';
export {
  normaliseKey,
  validateTerms,
  createIndex,
  suggestTerm,
  editDistance,
} from './resolve.js';
export { remarkGlossaryLinks } from './remark.js';

import { glossaryTerms } from './terms.js';
import { resolveGlossaryTerm as resolve } from './resolve.js';

/** Resolves a name, slug or alias to a term (default: the bundled manifest). */
export const resolveGlossaryTerm = (reference, terms = glossaryTerms) => resolve(reference, terms);
