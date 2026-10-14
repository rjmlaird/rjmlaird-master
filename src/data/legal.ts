export const siteLegal = {
  siteName: "Ryan J. M. Laird",
  siteUrl: "https://rjmlaird.co.uk",
  bookingUrl: "https://booking.rjmlaird.co.uk",
  impactOrbitUrl: "https://impactorbit.co/",
  controllerName: "Ryan J. M. Laird",
  privacyEmail: "privacy@rjmlaird.co.uk",
  contactEmail: "hello@rjmlaird.co.uk",
  country: "United Kingdom",
  icoComplaintUrl: "https://ico.org.uk/make-a-complaint/",
} as const;

/**
 * Single registry of every legal/related page. The layout's "related" list and
 * <ReadAlongside> both read from here, so a renamed route is a one-line change.
 */
export const legalLinks = {
  privacy: { href: "/privacy/", label: "Privacy notice" },
  cookies: { href: "/cookies/", label: "Cookie notice" },
  terms: { href: "/terms-of-use/", label: "Terms of use" },
  accessibility: { href: "/accessibility/", label: "Accessibility statement" },
  disclaimer: { href: "/disclaimer/", label: "Website disclaimer" },
  security: { href: "/security/", label: "Security notice" },
  securityTxt: { href: "/.well-known/security.txt", label: "security.txt" },
  safeguarding: { href: "/safeguarding/", label: "Safeguarding policy" },
  contact: { href: "/contact/", label: "Contact" },
  booking: { href: siteLegal.bookingUrl, label: "Booking portal" },
} as const;

export type LegalLinkKey = keyof typeof legalLinks;
