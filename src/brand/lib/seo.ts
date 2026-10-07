export const siteName = 'Ryan Laird brand system';
export const defaultDescription =
  'Visual identity, voice, design tokens and shared components for the Ryan Laird digital estate.';

export function pageTitle(title?: string) {
  return title ? `${title} | ${siteName}` : siteName;
}
