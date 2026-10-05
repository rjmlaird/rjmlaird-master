// Shared by astro.config.mjs (sitemap filter), Layout (noindex) and scripts/audit-content.mjs.
// Plain JS on purpose so Node can import it at config time.

const PLACEHOLDER_PATTERNS = [
  /a short summary of/i,
  /slightly longer excerpt/i,
  /yourname\/example-project/i,
  /^feature (one|two)$/i,
  /my-first-post/i,
  /blah blah/i,
];

const JUNK_TAGS = new Set(["example"]);
export const MIN_BODY_WORDS = 60;

const isPlaceholder = (v) => typeof v === "string" && PLACEHOLDER_PATTERNS.some((p) => p.test(v.trim()));

/**
 * @param {Record<string, any>} data  front matter
 * @param {string} [body]             markdown body
 * @returns {string[]} issues; empty means the entry is evidence-ready
 */
export function assessEntry(data = {}, body = "") {
  const issues = [];
  if (isPlaceholder(data.description)) issues.push("placeholder description");
  if (isPlaceholder(data.excerpt)) issues.push("placeholder excerpt");
  if ((data.features ?? []).some(isPlaceholder)) issues.push("placeholder features");
  if (Object.values(data.links ?? {}).some(isPlaceholder)) issues.push("placeholder link");
  if (isPlaceholder(data.image)) issues.push("placeholder image");
  if ((data.tags ?? []).some((t) => JUNK_TAGS.has(String(t).toLowerCase()))) issues.push("template tags");
  const cleaned = String(body).replace(/^#+\s*$/gm, "").replace(/blah blah blah/gi, "");
  const words = cleaned.trim() ? cleaned.trim().split(/\s+/).length : 0;
  if (words < MIN_BODY_WORDS) issues.push(`thin body (${words} words)`);
  return issues;
}

/** Explicit front-matter `evidenceReady` wins; otherwise derive from the audit. */
export function isEvidenceReady(data = {}, body = "") {
  if (typeof data.evidenceReady === "boolean") return data.evidenceReady;
  return assessEntry(data, body).length === 0;
}

/** Strip template text so it is never shown to visitors. */
export function cleanText(value) {
  return isPlaceholder(value) ? "" : value ?? "";
}

/** Drop template links such as github.com/yourname/example-project. */
export function cleanLinks(links = {}) {
  return Object.fromEntries(Object.entries(links).filter(([, v]) => v && !isPlaceholder(v)));
}
