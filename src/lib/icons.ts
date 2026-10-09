// src/lib/icons.ts

// Local SVGs in src/icons/ (e.g. src/icons/logo.svg -> "logo")
const localIcons = new Set(
  Object.keys(import.meta.glob("/src/icons/**/*.svg")).map((path) =>
    path.replace(/^\/src\/icons\//, "").replace(/\.svg$/, ""),
  ),
);

// Keys that need a different icon from the one in the JSON.
// Web of Science has no icon in any Iconify set; Clarivate is its parent brand.
const OVERRIDES: Record<string, string> = {
  webofscience: "simple-icons:clarivate",
};

// Hidden everywhere: duplicate of X, and a Discord entry with a placeholder ID
export const HIDDEN_SOCIALS = new Set(["twitter", "discord"]);

export function resolveIcon(icon?: string, key?: string): string | undefined {
  if (key && OVERRIDES[key]) return OVERRIDES[key];
  if (!icon) return undefined;
  if (icon.includes(":")) return icon; // already prefixed (e.g. "academicons:orcid")
  if (localIcons.has(icon)) return icon; // you have a local SVG with that name
  return `simple-icons:${icon}`;
}