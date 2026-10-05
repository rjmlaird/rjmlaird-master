// Topic taxonomy for /writing/. Nine areas; each piece is mapped by keyword to at most three.
export const TOPICS = [
  { slug: "space", label: "Space", match: ["space", "satellite", "orbit", "esa", "mission", "launch"] },
  { slug: "astronomy", label: "Astronomy", match: ["astronomy", "astrophysics", "comet", "telescope", "eso", "rosetta", "planet"] },
  { slug: "sustainability", label: "Sustainability", match: ["sustainab", "esg", "green", "net zero", "environment", "biodiversity"] },
  { slug: "climate-earth-observation", label: "Climate and Earth observation", match: ["climate", "earth observation", "copernicus", "atmosphere", "air quality", "weather", "eumetsat"] },
  { slug: "science-communication", label: "Science communication", match: ["science communication", "outreach", "storytelling", "public engagement", "podcast", "video"] },
  { slug: "misinformation", label: "Misinformation and public trust", match: ["misinformation", "disinformation", "trust", "integrity"] },
  { slug: "digital-strategy", label: "Digital strategy", match: ["seo", "content strategy", "digital", "marketing", "communications", "accessibility", "website"] },
  { slug: "open-source", label: "Open source and technology", match: ["open source", "open-source", "github", "code", "software", "data", "api"] },
  { slug: "career", label: "Career and professional practice", match: ["career", "mentoring", "professional", "freelance", "skills"] },
] as const;

export type TopicSlug = (typeof TOPICS)[number]["slug"];

export function topicsFor(...fields: (string | string[] | undefined)[]): TopicSlug[] {
  const hay = fields.flat().filter(Boolean).join(" ").toLowerCase();
  return TOPICS.filter((t) => t.match.some((m) => hay.includes(m))).map((t) => t.slug).slice(0, 3);
}
