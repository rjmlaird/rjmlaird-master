import socials from "../data/socials.json";

type Social = (typeof socials)[number];

// Only list keys that need a different icon from the one in the JSON.
// Web of Science has no icon in any Iconify set; Clarivate is its parent brand.
const ICON_OVERRIDES: Record<string, string> = {
  webofscience: "simple-icons:clarivate",
};

// Hidden for now: duplicate of X, and a Discord entry with a placeholder ID
const HIDDEN = new Set(["twitter", "discord"]);

export const iconName = (social: Social) =>
  ICON_OVERRIDES[social.key] ?? `simple-icons:${social.icon}`;

export const visibleSocials = socials.filter((s) => !HIDDEN.has(s.key));