// Hub world — the free-roam scene between levels.
// The player walks around and approaches doors to enter levels.

export const hubMap = [
  '###################################################',
  '#.................................................#',
  '#.................................................#',
  '#....D1.......D2.......D3.......D4.......D5......#',
  '#.................................................#',
  '#.................................................#',
  '#........................P........................#',
  '#.................................................#',
  '#.................................................#',
  '#....D6.......D7.......D8.......D9.......DA......#',
  '#.................................................#',
  '#.................................................#',
  '###################################################',
]

// Door positions match the D1–DA characters above
export const hubDoors = [
  { id: 1,  col: 5,  row: 3,  label: 'Level 1'  },
  { id: 2,  col: 14, row: 3,  label: 'Level 2'  },
  { id: 3,  col: 23, row: 3,  label: 'Level 3'  },
  { id: 4,  col: 32, row: 3,  label: 'Level 4'  },
  { id: 5,  col: 41, row: 3,  label: 'Level 5'  },
  { id: 6,  col: 5,  row: 9,  label: 'Level 6'  },
  { id: 7,  col: 14, row: 9,  label: 'Level 7'  },
  { id: 8,  col: 23, row: 9,  label: 'Level 8'  },
  { id: 9,  col: 32, row: 9,  label: 'Level 9'  },
  { id: 10, col: 41, row: 9,  label: 'Level 10' },
]

export const hubPlayerStart = { r: 6, c: 25 }

// One riddle per door. The answer is the word the teacher shares in class.
// Answers are lowercase, trimmed before comparison.
export const hubRiddles = [
  {
    id: 1,
    question: 'I have no mouth but speak to the wise. I have no eyes yet show the way. What am I?',
    answer: 'sign',
  },
  {
    id: 2,
    question: 'The more you take, the more you leave behind. What am I?',
    answer: 'steps',
  },
  {
    id: 3,
    question: 'I speak without a mouth and hear without ears. I have no body but come alive with the wind. What am I?',
    answer: 'echo',
  },
  {
    id: 4,
    question: 'What has keys but no locks, space but no room, and you can enter but cannot go inside?',
    answer: 'keyboard',
  },
  {
    id: 5,
    question: 'The more you share me, the more you have. What am I?',
    answer: 'knowledge',
  },
  {
    id: 6,
    question: 'I have a head and a tail but no body. What am I?',
    answer: 'coin',
  },
  {
    id: 7,
    question: 'What can you catch but not throw?',
    answer: 'cold',
  },
  {
    id: 8,
    question: 'What has to be broken before you can use it?',
    answer: 'egg',
  },
  {
    id: 9,
    question: 'I am light as a feather, yet the strongest person cannot hold me for more than a minute. What am I?',
    answer: 'breath',
  },
  {
    id: 10,
    question: 'I have cities but no houses, forests but no trees, and water but no fish. What am I?',
    answer: 'map',
  },
]