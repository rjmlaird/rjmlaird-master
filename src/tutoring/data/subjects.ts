export type Subject = {
  slug: string;
  name: string;
  status: 'live' | 'planned'; // only 'live' subjects get pages
  summary: string;
  covers: string[];
  levels: string[];
};

export const subjects: Subject[] = [
  {
    slug: 'physics',
    name: 'Physics',
    status: 'live',
    summary:
      'Build a secure understanding of the physics, then learn to apply it to unfamiliar exam questions.',
    covers: [
      'Forces, motion and energy',
      'Waves, light and electromagnetism',
      'Electricity and circuits',
      'Particle, nuclear and atomic physics',
      'Practical skills, data handling and required practicals',
      'Mathematical methods for physics: rearranging, units, estimation, graphs',
    ],
    levels: ['gcse', 'a-level'],
  },
  {
    slug: 'astronomy',
    name: 'Astronomy and astrophysics',
    status: 'live',
    summary:
      'Enrichment for students who want to go beyond the syllabus: observing, orbits, stars, cosmology and how we know what we know.',
    covers: [
      'The night sky and observing basics',
      'Orbits, gravity and space missions',
      'Stellar life cycles and the Hertzsprung–Russell diagram',
      'Exoplanets and detection methods',
      'Cosmology and the expanding universe',
      'Support for EPQs, personal statements and astronomy-related projects',
    ],
    levels: ['gcse', 'a-level'],
  },
  // Add these only when you are genuinely ready to offer and maintain them.
  { slug: 'maths', name: 'Maths', status: 'planned', summary: '', covers: [], levels: [] },
  { slug: 'chemistry', name: 'Chemistry', status: 'planned', summary: '', covers: [], levels: [] },
  { slug: 'computing', name: 'Computing and IT', status: 'planned', summary: '', covers: [], levels: [] },
];

export const liveSubjects = subjects.filter((s) => s.status === 'live');
