// Small helpers shared by the schema.org builders.

/** Recursively drops undefined/null/empty-string/empty-array/empty-object values so the output is clean JSON-LD. */
export function clean<T>(value: T): T {
  if (Array.isArray(value)) {
    const arr = value.map(clean).filter((v) => v !== undefined);
    return (arr.length ? arr : undefined) as T;
  }
  if (value && typeof value === "object" && !(value instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const c = clean(v);
      if (c === undefined || c === null || c === "") continue;
      out[k] = c;
    }
    return (Object.keys(out).length ? out : undefined) as T;
  }
  return value;
}

export const dedupe = (values: Array<string | undefined | null>): string[] =>
  Array.from(new Set(values.filter((v): v is string => Boolean(v && v.trim())).map((v) => v.trim())));

/** Case/punctuation-insensitive key for matching organisation names across sources. */
export const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

export const slugify = (s: string) => norm(s).replace(/ /g, "-");

/** Normalises a URL: adds https:// to bare hosts, drops tracking/fragment noise, rejects obvious placeholders. */
/** Unfilled template values that exist in socials.json and must never reach structured data. */
export const PLACEHOLDER_MARKERS = ["your-user-id", "441234567890", "0000-0000-0000-0000", "XXXXXXXXXXX", "YourName", "1234567"];

export function normaliseUrl(raw?: string | null): string | undefined {
  if (!raw) return undefined;
  let u = raw.trim();
  if (!u || PLACEHOLDER_MARKERS.some((m) => u.includes(m)) || /example\.(com|org)|your-?(username|handle)|placeholder|^#|^mailto:|^tel:/i.test(u)) return undefined;
  if (!/^https?:\/\//i.test(u)) {
    if (u.startsWith("/")) return u;
    u = `https://${u}`;
  }
  try {
    const url = new URL(u);
    url.hash = "";
    return url.toString();
  } catch {
    return undefined;
  }
}

/** Date value → ISO 8601 date (YYYY, YYYY-MM or YYYY-MM-DD preserved; full dates normalised). */
export function toIsoDate(value?: string | Date | null): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value.toISOString();
  const v = value.trim();
  if (/^\d{4}(-\d{2}){0,2}$/.test(v)) return v;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString();
}
