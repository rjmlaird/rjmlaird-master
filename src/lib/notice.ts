export interface NoticeSection<Id extends string = string, Label extends string = string> {
  id: Id;
  label: Label;
  href: `#${Id}`;
}

/**
 * Define a page's sections once. `list` feeds the layout's "On this page" nav;
 * `by` gives typed access for <LegalSection> and in-page links, so ids can't
 * drift between the nav, the <section> and `href="#..."` references.
 *
 *   const s = defineSections({ overview: "Overview", "cookie-inventory": "Cookie inventory" });
 *   <LegalNoticeLayout sections={s.list}>
 *   <LegalSection section={s.by.overview}>
 *   <a href={s.by["cookie-inventory"].href}>
 */
export function defineSections<const T extends Record<string, string>>(labels: T) {
  const list = Object.entries(labels).map(([id, label]) => ({
    id,
    label,
    href: `#${id}` as const,
  }));

  const by = Object.fromEntries(list.map((section) => [section.id, section])) as {
    [K in keyof T & string]: NoticeSection<K, T[K]>;
  };

  return { list, by };
}

export interface Column {
  key: string;
  label: string;
  /** Column width as a CSS value, e.g. "20%". */
  width?: string;
}

/**
 * A table cell: plain text, a link, or labelled parts rendered as
 * "Label: value" paragraphs (replaces hand-written <br /><br /> stacks).
 */
export type Cell =
  | string
  | { href: string; text?: string }
  | { label: string; value: string }[];

export type Row = Record<string, Cell>;
