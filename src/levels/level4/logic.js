// Level 4 — Multi-round + Strength Tokens
// Player completes 3 sub-rounds collecting strength tokens.
// The final round's boxes are too heavy to push without them.

export const rounds = [
  {
    map: [
      '###########',
      '#.........#',
      '#..T......#',
      '#.........#',
      '#..B......#',
      '#....P....#',
      '#.......$.#',
      '###########',
    ],
    tokensHere: [{ r: 6, c: 8, type: 'strength', amount: 30 }],
  },
  {
    map: [
      '###########',
      '#.........#',
      '#..T..T...#',
      '#.........#',
      '#..B..B...#',
      '#....P....#',
      '#.$.....$.#',
      '###########',
    ],
    tokensHere: [
      { r: 6, c: 2, type: 'strength', amount: 20 },
      { r: 6, c: 8, type: 'strength', amount: 20 },
    ],
  },
  {
    map: [
      '#############',
      '#...........#',
      '#..T..T..T..#',
      '#...........#',
      '#...........#',
      '#..B..B..B..#',
      '#.....P.....#',
      '#############',
    ],
    isFinal: true,
    requiresStrength: 50,
  },
]

export const config = {
  topStripMode: 'narrative',
  bottomStripMode: 'tokens',
  narrativeText: '💪 Collect Strength Tokens across rounds to power the final push!',
  multiRound: true,
  tokenType: 'strength',
}