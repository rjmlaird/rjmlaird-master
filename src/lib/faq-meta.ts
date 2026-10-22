/**
 * Controlled vocabularies for the FAQ collection.
 * Edit this file (not the schema) when you add a service or audience.
 * It has no Astro imports, so content.config.ts can import it safely.
 */

export const TOPIC_IDS = [
  'speaking',
  'coaching',
  'communication',
  'writing',
  'research',
  'projects',
  'contact',
  'general',
] as const;
export type TopicId = (typeof TOPIC_IDS)[number];

export const AUDIENCE_IDS = ['client', 'school', 'researcher', 'publisher', 'general'] as const;
export type AudienceId = (typeof AUDIENCE_IDS)[number];

export interface TopicMeta {
  /** Heading shown on the central /faq/ page. */
  label: string;
  /** Service/section page this topic belongs to. Omit if there is none. */
  href?: string;
  /** Descriptive link text for "back to the service page" links. */
  linkLabel?: string;
}

/** Object key order = display order on /faq/. */
export const TOPICS: Record<TopicId, TopicMeta> = {
  general: { label: 'Working together' },
  contact: {
    label: 'Contact and enquiries',
    href: '/contact/',
    linkLabel: 'Go to the contact page',
  },
  speaking: {
    label: 'Speaking',
    href: '/services/speaking-collaboration/',
    linkLabel: 'More about speaking engagements',
  },
  coaching: {
    label: 'Coaching and tutoring',
    href: '/services/teaching-mentoring/',
    linkLabel: 'More about coaching and tutoring',
  },
  communication: {
    label: 'Science and sustainability communication',
    href: '/services/strategic-communication/',
    linkLabel: 'More about science and sustainability communication',
  },
  writing: {
    label: 'Writing and republishing',
    href: '/services/strategic-communication/',
    linkLabel: 'More about writing and republishing',
  },
  research: {
    label: 'Research collaboration',
    href: '/research/',
    linkLabel: 'More about research collaboration',
  },
  projects: {
    label: 'Projects and case studies',
    href: '/work/',
    linkLabel: 'Browse all project case studies',
  },
};

export const TOPIC_ORDER = Object.keys(TOPICS) as TopicId[];

/** Link text that fails WCAG 2.4.4 (link purpose) on its own. */
export const GENERIC_LINK_TEXT = new Set([
  'here',
  'click here',
  'read more',
  'more',
  'link',
  'this page',
  'learn more',
]);
