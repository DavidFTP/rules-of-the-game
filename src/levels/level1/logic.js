// Level 1 — Tutorial with a hidden clue
// The top strip scrolls tutorial text. Buried inside it is the real clue:
// "push the GREY box LAST". Kids who read carefully win easily.
// Kids who skip the tutorial will struggle — the grey box blocks the path
// if pushed first.

export const map = [
  '############',
  '#..........#',
  '#.T..T..T..#',
  '#..........#',
  '#..........#',
  '#..B..B....#',
  '#.......Bg.#',
  '#....P.....#',
  '#..........#',
  '############',
]

// Override parsed boxes with typed metadata
export const boxes = [
  { r: 5, c: 3, type: 'blue',  id: 'box-blue-1' },
  { r: 5, c: 6, type: 'green', id: 'box-green-1' },
  { r: 6, c: 8, type: 'grey',  id: 'box-grey-1' },
]

export const targets = [
  { r: 2, c: 3 },
  { r: 2, c: 6 },
  { r: 2, c: 9 },
]

export const playerStart = { r: 7, c: 5 }

export const config = {
  topStripMode: 'marquee',
  bottomStripMode: 'tokens',

  // Scrolling tutorial segments. The string 'CLUE' is replaced by the
  // renderer with a highlighted gold span — the hidden clue kids skip over.
  tutorialSegments: [
    'Use Arrow Keys to move.  ',
    'Push boxes onto the green targets.  ',
    'You can only PUSH boxes — not pull.  ',
    'Press Z to undo a move.  ',
    'Press R to restart the level.  ',
    '⚠ Pay attention: ',
    'CLUE',   // <-- rendered gold + bold
    '  Try to push all boxes without getting stuck.  ',
    'Hint — the ORDER you push boxes matters!  ',
  ],

  // The grey box must be pushed LAST. The engine tracks placed order.
  // If grey is placed before the others the level is still technically
  // solvable, but the layout makes it very hard — this is intentional.
  // (Full order-enforcement can be toggled on here for a stricter version)
  enforceOrder: false,
  requiredOrder: ['blue', 'green', 'grey'],
}