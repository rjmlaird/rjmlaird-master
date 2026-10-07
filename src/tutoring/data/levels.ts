export type Level = {
  slug: string;
  name: string;
  summary: string;
  focus: string[];
};

export const levels: Level[] = [
  {
    slug: 'gcse',
    name: 'GCSE',
    summary:
      'Confidence with core ideas, equations and exam technique, at a pace that suits the student.',
    focus: [
      'Filling gaps from earlier topics so new ones make sense',
      'Working confidently with equations, units and graphs',
      'Practising exam-style questions and explaining answers clearly',
      'Revision planning that fits around school',
    ],
  },
  {
    slug: 'a-level',
    name: 'A-level',
    summary:
      'Depth, rigour and problem-solving for students who need to move from knowing the content to using it.',
    focus: [
      'Unpacking difficult topics such as fields, oscillations and quantum ideas',
      'Extended problem-solving and mathematical fluency',
      'Practical endorsement and data analysis',
      'Exam-preparation sessions and mark-scheme literacy',
    ],
  },
];
