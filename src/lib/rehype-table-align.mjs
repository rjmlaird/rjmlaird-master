// The unified processor emits the legacy `align` attribute on table cells; the Rust processor
// it replaced emitted `style="text-align: ..."`. Site CSS can override the attribute, so
// restore the inline style to keep GFM column alignment exactly as it was.
export function rehypeTableAlign() {
  return (tree) => {
    const walk = (node) => {
      if (node.type === 'element' && (node.tagName === 'th' || node.tagName === 'td')) {
        const align = node.properties?.align;
        if (align) {
          delete node.properties.align;
          const prior = node.properties.style ? `${String(node.properties.style).replace(/;?\s*$/, '')}; ` : '';
          node.properties.style = `${prior}text-align: ${align}`;
        }
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}
