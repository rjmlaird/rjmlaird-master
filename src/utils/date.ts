// src/utils/date.ts
// One place for date parsing/formatting (en-GB) so every card, meta row and
// sidebar renders dates the same way.
export type DateInput = Date | string | number | null | undefined;

export function toDate(value: DateInput): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatDate(value: DateInput, style: "long" | "short" = "long"): string {
  const d = toDate(value);
  if (!d) return "";
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: style === "long" ? "long" : "short",
    day: "numeric",
  });
}

/** "12 Mar 2026", "12–14 Mar 2026" or "30 Mar – 2 Apr 2026" style ranges. */
export function formatDateRange(start: DateInput, end: DateInput): string {
  const s = toDate(start);
  const e = toDate(end);
  if (!s) return "";
  if (!e) return formatDate(s, "short");

  const sameMonth = s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth();
  if (sameMonth && s.getDate() === e.getDate()) return formatDate(s, "short");
  if (sameMonth) {
    const monthYear = s.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
    return `${s.getDate()}–${e.getDate()} ${monthYear}`;
  }
  return `${formatDate(s, "short")} – ${formatDate(e, "short")}`;
}

export const isoDate = (value: DateInput) => toDate(value)?.toISOString() ?? "";

/** Long date, plus HH:MM when the value carries a real time of day. */
export function formatDateTime(value: DateInput): string {
  const d = toDate(value);
  if (!d) return "";
  const date = formatDate(d);
  const hasTime = d.getHours() || d.getMinutes() || d.getSeconds() || d.getMilliseconds();
  if (!hasTime) return date;
  return `${date}, ${d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;
}
