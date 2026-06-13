import { round1Map, round2Map, round3Map } from './map.js';

// Level 1 — Moses & The Law [cite: 29]
export const config = {
  theme: 'level1',
  topStripMode: 'marquee',
  bottomStripMode: 'tokens',
  hasTutorialButton: true,
  tutorialSegments: [
    'Welcome to Level 1! Today\'s hero is Moses, who received the Law.',
    'In God\'s path, we must know the rules and not rush like the rest of the world.',
    'Use Arrow Keys to move. Push boxes onto the targets.',
    'Press Z to undo, and R to restart.',
    '⚠️ Pay close attention to this secret:',
    'Most players rush and get stuck.',
    'The secret in Round 3: Order matters!',
    'You MUST push the BLUE box first, then GREEN, and GREY last!'
  ],
};

export const rounds = [
  // ── Round 1: one box, one target ──
  {
    map: round1Map,
    playerStart: { r: 3, c: 3 },
  },

  // ── Round 2: two boxes, figure out which goes first ──
  {
    map: round2Map,
    boxes: [
      { r: 3, c: 2, type: 'brown', id: 'r2-green' },
      { r: 4, c: 7,  id: 'r2-blue'  },
    ],
    targets: [
      { r: 1, c: 7 },
      { r: 5, c: 1 },
    ],
    playerStart: { r: 5, c: 7 },
  },

  // ── Round 3: three boxes — grey must go last ──
  // ── Round 3: The Clue Test ──
  {
    map: round3Map,
    boxes: [
      { r: 5, c: 3,  type: 'blue',  id: 'r3-blue'  },
      { r: 5, c: 6,  type: 'grey',  id: 'r3-grey'  }, // Grey is now in the middle
      { r: 5, c: 9,  type: 'green', id: 'r3-green' }, // Green is now on the right
    ],
    targets: [
      { r: 2, c: 5 },
      { r: 2, c: 8 },
      { r: 2, c: 11 },
    ],
    playerStart: { r: 6, c: 6 },
    config: {
      enforceOrder: true,
      requiredOrder: ['blue', 'green', 'grey'],
    },
    isFinal: true,
  },
];