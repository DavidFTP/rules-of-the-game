// Level 7 — High Risk / High Reward
// Gold boxes are worth more tokens but trigger crack tiles.
// Silver boxes are safe and push smoothly.
// Lesson: more is not always better.

export const map = [
  '#############',
  '#...........#',
  '#..T.....T..#',
  '#...........#',
  '#...CC......#',
  '#...........#',
  '#..Bg....Bs.#',
  '#.....P.....#',
  '#...........#',
  '#############',
]

export const boxes = [
  { r: 6, c: 3, type: 'gold',   id: 'box-gold',   value: 100 },
  { r: 6, c: 8, type: 'silver', id: 'box-silver',  value: 10  },
]

export const targets = [
  { r: 2, c: 3 },
  { r: 2, c: 8 },
]

// Crack tiles are encoded in the map as 'C', but we also list them here
// so the engine can check if a gold box is pushed over one
export const crackPositions = [
  { r: 4, c: 4 },
  { r: 4, c: 5 },
]

export const playerStart = { r: 7, c: 6 }

export const config = {
  topStripMode: 'narrative',
  bottomStripMode: 'tokens',
  narrativeText: '⚠ High-value crates are tempting... but the floor may not hold them!',
  crackTrigger: 'gold',
}