// Level 3 — Co-op
// Two players on one keyboard.
// P1: Arrow Keys | P2: WASD
// Some boxes are positioned so that coordinated pushes are faster,
// but the level is still solvable solo (just harder).

export const map = [
  '##############',
  '#............#',
  '#..T....T....#',
  '#............#',
  '#............#',
  '#..B....B....#',
  '#............#',
  '#..P....2....#',
  '#............#',
  '##############',
]

export const playerStart  = { r: 7, c: 3 }
export const player2Start = { r: 7, c: 8 }

export const config = {
  topStripMode: 'narrative',
  bottomStripMode: 'tokens',
  narrativeText: '👫 Two heads are better than one!  P1: Arrow Keys  |  P2: WASD',
  coop: true,
}