/** Internal page URL with leading and trailing slash. */
/** The brand section is mounted at /about/brand/ on this site. */
export const brandHome = '/about/brand/';
export const url = (path: string) => brandHome + path.replace(/^\/+|\/+$/g, '') + '/';

export const siteUrl = (host: string) => `https://${host}`;
