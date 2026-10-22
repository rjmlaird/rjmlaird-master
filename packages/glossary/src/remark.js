import path from 'node:path';
import { glossaryTerms } from './terms.js';
import { resolveGlossaryTerm, suggestTerm, createIndex } from './resolve.js';

/** Node types whose contents are never searched for references. */
const SKIP = new Set([
  'link', 'linkReference', 'image', 'imageReference', 'definition',
  'inlineCode', 'code', 'html', 'yaml', 'toml', 'math', 'inlineMath',
  'mdxjsEsm', 'mdxFlowExpression', 'mdxTextExpression',
]);

// [target] or [target|visible text]; brackets may not nest and may not span lines.
const REFERENCE = /\[([^\[\]\n|]+?)(?:\|([^\[\]\n]+?))?\]/g;
// A plausible term: words, numbers, spaces, hyphens, apostrophes, ampersands.
// Anything else ("[...]", "[1]", "[^note]", "[x]") is ordinary prose, not a reference.
const TERM_SHAPE = /^[\p{L}\p{N}][\p{L}\p{N} '\u2019&-]*$/u;

function looksLikeReference(target) {
  return (
    target.length <= 80 &&
    TERM_SHAPE.test(target) &&
    !/^\d+$/.test(target) &&
    !/^x$/i.test(target) // GFM task-list markers
  );
}

function displayPath(file) {
  const p = file?.path;
  if (!p) return 'unknown file';
  const rel = path.relative(process.cwd(), p);
  return rel && !rel.startsWith('..') ? rel : p;
}

/**
 * Remark plugin: turns explicit `[term]` / `[term|text]` references into links to the
 * canonical glossary page. Ordinary words are never linked.
 *
 * @param {import('./index.js').RemarkGlossaryOptions} [options]
 */
export function remarkGlossaryLinks(options = {}) {
  const { strict = true, terms = glossaryTerms, className = 'glossary-link' } = options;
  createIndex(terms); // fail fast on an invalid manifest

  return function transformer(tree, file) {
    const source = typeof file?.value === 'string' ? file.value : undefined;

    const unknown = (target) => {
      const hint = suggestTerm(target, terms);
      const message =
        `Unknown glossary reference "${target}" in content file "${displayPath(file)}".` +
        (hint ? `\nDid you mean "${hint.term}"?` : '');
      if (strict) throw new Error(message);
      console.warn(`[glossary] ${message}`);
    };

    function transformText(node) {
      const value = node.value;
      if (!value.includes('[')) return [node];

      // Raw source for this node, used only to honour `\[escaped\]` brackets, which the
      // parser decodes to a plain "[" before this plugin runs.
      const raw =
        source && node.position?.start?.offset != null
          ? source.slice(node.position.start.offset, node.position.end.offset)
          : '';

      const out = [];
      let last = 0;
      for (const m of value.matchAll(REFERENCE)) {
        const [whole, rawTarget, rawVisible] = m;
        const target = rawTarget.trim();
        if (!looksLikeReference(target)) continue;
        if (raw && raw.includes(`\\[${rawTarget}`)) continue; // escaped on purpose

        const term = resolveGlossaryTerm(target, terms);
        if (!term) {
          unknown(target);
          continue;
        }
        let visible = rawVisible?.trim();
        if (!visible) {
          // "[earth-observation]" reads better as the term's own name.
          visible = target === term.slug && target.includes('-') ? term.term : target;
        }

        if (m.index > last) out.push({ type: 'text', value: value.slice(last, m.index) });
        out.push({
          type: 'link',
          url: term.url,
          title: null,
          children: [{ type: 'text', value: visible }],
          data: { hProperties: { className: [className] } },
          position: node.position,
        });
        last = m.index + whole.length;
      }
      if (!out.length) return [node];
      if (last < value.length) out.push({ type: 'text', value: value.slice(last) });
      return out;
    }

    function walk(node) {
      if (!node.children || SKIP.has(node.type)) return;
      // A raw <a> written in MDX is an existing link.
      if ((node.type === 'mdxJsxTextElement' || node.type === 'mdxJsxFlowElement') && node.name === 'a') return;

      const next = [];
      for (const child of node.children) {
        if (child.type === 'text') next.push(...transformText(child));
        else {
          if (!SKIP.has(child.type)) walk(child);
          next.push(child);
        }
      }
      node.children = next;
    }

    walk(tree);
  };
}
