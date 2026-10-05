const WORDS_PER_MINUTE = 200;

/** Estimate reading time from raw markdown/MDX body text. */
export function getReadingTime(rawBody: string): string {
  const words = rawBody
    .replace(/```[\s\S]*?```/g, '') // strip code blocks, they read faster than they scan
    .trim()
    .split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}
