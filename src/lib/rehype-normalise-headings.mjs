// Keeps rendered Markdown/MDX from competing with the page template's own <h1>.
//   1. Empty headings (a bare "# " line) are dropped: they are announced as "heading, empty".
//   2. A body-level h1 becomes an h2, so each page keeps exactly one h1 (the template's title).
// Only the rendered output changes; the Markdown source is untouched.
const HEADING = /^h[1-6]$/;

const hasContent = (node) => {
  if (node.type === 'text') return node.value.trim() !== '';
  if (node.type === 'element' && (node.tagName === 'img' || node.tagName === 'svg')) return true;
  return (node.children ?? []).some(hasContent);
};

export function rehypeNormaliseHeadings() {
  return (tree) => {
    const walk = (node) => {
      if (!node.children) return;
      node.children = node.children.filter(
        (child) => !(child.type === 'element' && HEADING.test(child.tagName) && !hasContent(child)),
      );
      for (const child of node.children) {
        if (child.type === 'element' && child.tagName === 'h1') child.tagName = 'h2';
        walk(child);
      }
    };
    walk(tree);
  };
}
