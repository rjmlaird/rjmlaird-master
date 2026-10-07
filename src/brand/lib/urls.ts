/** Internal page URL with leading and trailing slash. */
export const url = (path: string) => '/brand/' + path.replace(/^\/+|\/+$/g, '') + '/';

export const siteUrl = (host: string) => `https://${host}`;
