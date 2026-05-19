// Level 6 — Two Councils
// The top strip is split: one side tells you the wrong order (the world),
// the other tells you the right order (truth).
// Only putting blue box first, then red, wins the level.

export const map = [
  '############',
  '#..........#',
  '#..T....T..#',
  '#..........#',
  '#..........#',
  '#..Br...Bb.#',
  '#....P.....#',
  '#..........#',
  '############',
]

export const boxes = [
  { r: 5, c: 3, type: 'red',  id: 'box-red'  },
  { r: 5, c: 8, type: 'blue', id: 'box-blue' },
]

export const targets = [
  { r: 2, c: 3 },
  { r: 2, c: 8 },
]

export const playerStart = { r: 6, c: 5 }

export const config = {
  topStripMode: 'council',
  bottomStripMode: 'tokens',
  council: {
    worldSays: 'Push the RED box first — it\'s the heaviest and most important.',
    truthSays: 'Begin with the BLUE box. Small steps, right order. Blue first.',
  },
  // Blue must be placed on target before red
  requiredOrder: ['blue', 'red'],
  enforceOrder: true,
}