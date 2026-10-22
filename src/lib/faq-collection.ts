// FAQ collection definition (from rjmlaird-faq-kit). Registered in src/content.config.ts.
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { AUDIENCE_IDS, GENERIC_LINK_TEXT, TOPIC_IDS } from './faq-meta';

const kebab = /^[a-z0-9]+(-[a-z0-9]+)*$/;
/** Internal path only: "/speaking/" yes, "//evil.com" and "https://…" no. */
const internalPath = z.string().regex(/^\/(?!\/)/, 'Must be an internal path starting with a single "/"');
/** CTA may also be mailto: or https:. */
const ctaHref = z
  .string()
  .regex(/^(\/(?!\/)|mailto:|https:\/\/)/, 'Use an internal path, mailto: or https:// URL');

const descriptiveLabel = z
  .string()
  .min(6)
  .max(80)
  .refine((v) => !GENERIC_LINK_TEXT.has(v.trim().toLowerCase()), {
    message: 'Link text must make sense out of context (not "here" / "read more")',
  });

export const faqs = defineCollection({
  // The file name (without .md) is the stable id. Convention: <topic>-<slug>.md
  loader: glob({ pattern: '**/*.md', base: './src/content/faqs' }),
  schema: z
    .object({
      /** Display question. Must be a real question, phrased as the reader would ask it. */
      question: z
        .string()
        .min(10)
        .max(140)
        .refine((v) => v.trim().endsWith('?'), { message: 'Question must end with "?"' }),

      /** Optional 1–2 sentence answer for cards, search snippets or summaries. */
      shortAnswer: z.string().min(20).max(240).optional(),

      /** Who the answer is written for. Used for filtering, never shown as a label. */
      audience: z.array(z.enum(AUDIENCE_IDS)).min(1).default(['general']),

      /** Primary topic. Drives grouping on /faq/ and the file-name prefix. */
      topic: z.enum(TOPIC_IDS),

      /** Free-form kebab-case tags for finer filtering (e.g. "virtual", "schools"). */
      tags: z.array(z.string().regex(kebab, 'Tags must be kebab-case')).default([]),

      /**
       * Where the FAQ appears. Page ids are paths without slashes:
       * "speaking", "work/example-case-study", "faq". A trailing "/*" matches a section
       * ("work/*"). Use "home" for the homepage.
       */
      pageTargets: z.array(z.string().min(1)).default([]),

      /** Ordering weight within a page. LOWER comes first. 1–100, default 50. */
      priority: z.number().int().min(1).max(100).default(50),

      /** draft = dev only; published = built; archived = never built. */
      status: z.enum(['draft', 'published', 'archived']).default('draft'),

      /** Date someone last checked the answer is still true (YYYY-MM-DD). */
      lastReviewed: z.coerce.date(),

      /** Up to three internal "next step" links. */
      relatedLinks: z
        .array(z.object({ label: descriptiveLabel, href: internalPath }))
        .max(3)
        .default([]),

      /** Optional call to action shown under the answer. */
      cta: z.object({ label: descriptiveLabel, href: ctaHref }).optional(),

      /**
       * Opt in to FAQPage JSON-LD for this item. Off by default. See README.
       * Only emitted when the page also asks for it (<FaqSection schema />).
       */
      schema: z.boolean().default(false),

      /** Page id that owns the JSON-LD when the FAQ appears on several pages. */
      schemaPage: z.string().optional(),

      /** For archived entries: id of the FAQ (or note) that replaced this one. */
      supersededBy: z.string().regex(kebab).optional(),

      /** For archived entries with no replacement: why it was retired. */
      archivedReason: z.string().min(5).optional(),
    })
    .superRefine((d, ctx) => {
      const issue = (path: string, message: string) =>
        ctx.addIssue({ code: 'custom', path: [path], message });

      if (d.lastReviewed.getTime() > Date.now() + 86_400_000) {
        issue('lastReviewed', 'lastReviewed cannot be in the future');
      }
      if (d.status === 'published' && d.pageTargets.length === 0) {
        issue('pageTargets', 'A published FAQ needs at least one page target');
      }
      if (d.status === 'archived' && !d.supersededBy && !d.archivedReason) {
        issue('archivedReason', 'Archived FAQs need supersededBy or archivedReason');
      }
      if (d.schema) {
        if (d.status !== 'published') issue('schema', 'Only published FAQs can emit schema');
        if (d.pageTargets.length !== 1 && !d.schemaPage) {
          issue('schemaPage', 'Set schemaPage when schema is on and the FAQ has several page targets');
        }
        if (d.schemaPage && (d.schemaPage.includes('*') || !d.pageTargets.includes(d.schemaPage))) {
          issue('schemaPage', 'schemaPage must be one of pageTargets and cannot be a wildcard');
        }
      }
    }),
});
