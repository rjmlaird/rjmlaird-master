// src/utils/youtube.ts
const ID = /^[\w-]{11}$/;

/** Accepts a bare id, "v=<id>", or any watch / embed / shorts / youtu.be URL. */
export function getYouTubeId(input?: string | null): string | null {
  if (!input) return null;
  const value = input.trim().replace(/^v=/, "");
  if (ID.test(value)) return value;

  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1).split("/")[0] || null;
    const v = url.searchParams.get("v");
    if (v && ID.test(v)) return v;
    const path = url.pathname.match(/\/(?:embed|v|shorts)\/([\w-]{11})/);
    return path?.[1] ?? null;
  } catch {
    return null;
  }
}

export const youTubeEmbedUrl = (id: string) => `https://www.youtube-nocookie.com/embed/${id}`;
export const youTubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;
export const youTubeThumbnail = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
