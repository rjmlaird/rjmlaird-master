export type Session = {
  id: string;
  name: string;
  minutes: number;
  price: string | null; // null shows "Price on request" until you set real prices
  description: string;
  free?: boolean;
};

export const sessions: Session[] = [
  {
    id: 'consultation',
    name: 'Initial consultation',
    minutes: 20,
    price: null,
    free: true,
    description:
      'A short call with the student and/or parent or carer to talk about goals, current progress and whether we are a good fit.',
  },
  {
    id: 'gcse-physics',
    name: 'GCSE Physics',
    minutes: 60,
    price: null,
    description: 'One-to-one online session on the topics and skills the student needs most.',
  },
  {
    id: 'a-level-physics',
    name: 'A-level Physics',
    minutes: 75,
    price: null,
    description: 'Longer sessions for in-depth topics and worked problem-solving.',
  },
  {
    id: 'astronomy-enrichment',
    name: 'Astronomy and astrophysics enrichment',
    minutes: 60,
    price: null,
    description: 'Guided exploration beyond the syllabus, or support for a project such as an EPQ.',
  },
  {
    id: 'exam-preparation',
    name: 'Exam preparation',
    minutes: 75,
    price: null,
    description: 'Targeted practice with past-paper questions, timing and mark-scheme technique.',
  },
  {
    id: 'study-planning',
    name: 'Study planning',
    minutes: 45,
    price: null,
    description: 'Build a realistic revision plan and learn methods that make studying stick.',
  },
];
