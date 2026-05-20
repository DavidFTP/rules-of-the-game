// Level 1 — Tutorial with a hidden clue + 3 practice rounds
//
// Round 1: Simple intro — 1 box, 1 target. Gets the kid moving.
// Round 2: Two boxes. Introduces the idea that order matters.
// Round 3: Three boxes (green, blue, grey). The hidden clue in the
//          scrolling tutorial strip tells them: "push the GREY box LAST".
//          Kids who read carefully breeze through. Kids who skip the
//          tutorial will try grey first and get stuck.

export const config = {
  topStripMode: 'marquee',
  bottomStripMode: 'tokens',
  tutorialSegments: [
    'Use Arrow Keys to move.  ',
    'Push boxes onto the green targets.  ',
    'You can only PUSH boxes — not pull.  ',
    'Press Z to undo a move.  Press R to restart.  ',
    '⚠ Pay close attention: ',
    'CLUE',
    '  Most players rush and miss the secret.  ',
    'Hint — the ORDER you push boxes matters!  ',
  ],
  enforceOrder: false,
  requiredOrder: ['blue', 'green', 'grey'],
}

export const rounds = [
  // ── Round 1: one box, one target ──
  {
    map: [
      '##########',
      '#........#',
      '#..T.....#',
      '#........#',
      '#..B.....#',
      '#....P...#',
      '#........#',
      '##########',
    ],
    playerStart: { r: 5, c: 5 },
  },

  // ── Round 2: two boxes, figure out which goes first ──
  {
    map: [
      '############',
      '#..........#',
      '#..T...T...#',
      '#..........#',
      '#..B...B...#',
      '#.....P....#',
      '#..........#',
      '############',
    ],
    boxes: [
      { r: 4, c: 3, type: 'green', id: 'r2-green' },
      { r: 4, c: 7, type: 'blue',  id: 'r2-blue'  },
    ],
    targets: [
      { r: 2, c: 3 },
      { r: 2, c: 7 },
    ],
    playerStart: { r: 5, c: 6 },
  },

  // ── Round 3: three boxes — grey must go last ──
  {
    map: [
      '##############',
      '#............#',
      '#..T...T...T.#',
      '#............#',
      '#..B...B...B.#',
      '#......P.....#',
      '#............#',
      '##############',
    ],
    boxes: [
      { r: 4, c: 3,  type: 'blue',  id: 'r3-blue'  },
      { r: 4, c: 7,  type: 'green', id: 'r3-green' },
      { r: 4, c: 11, type: 'grey',  id: 'r3-grey'  },
    ],
    targets: [
      { r: 2, c: 3  },
      { r: 2, c: 7  },
      { r: 2, c: 11 },
    ],
    playerStart: { r: 5, c: 7 },
    isFinal: true,
  },
]
