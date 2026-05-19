// Level 10 — Work Beats Wealth
// Buying anything in the shop makes the final round unwinnable.
// Extra boxes are available but need purchases to push.
// Core boxes (enough to win) need no purchases — just effort.
// Lesson: you don't need money, you need hard work.

export const rounds = [
  {
    map: [
      '#############',
      '#...........#',
      '#.T..T..T...#',
      '#...........#',
      '#.B..B..B...#',
      '#.........X.#',  // X = extra box (needs purchase to push)
      '#.....P.....#',
      '#...........#',
      '#############',
    ],
    extraBoxPositions: [{ r: 5, c: 10 }],
    tokensEarned: 20,
    playerStart: { r: 6, c: 6 },
  },
  {
    map: [
      '##############',
      '#............#',
      '#.T..T..T.T..#',
      '#............#',
      '#.B..B.......#',  // Only 2 core boxes — enough for 2 of 4 targets
      '#............#',  // Player must work harder to find the other 2
      '#.B..........#',  // hidden core box slightly out of the way
      '#......P.....#',
      '#............#',
      '##############',
    ],
    isFinal: true,
    // If player bought anything, the 3rd and 4th targets are blocked
    penaltyOnPurchase: true,
    playerStart: { r: 7, c: 7 },
  },
]

export const shop = {
  items: [
    { name: 'Easy Push',   cost: 10, key: 'easyPush',   tempting: true },
    { name: 'Super Speed', cost: 10, key: 'superSpeed', tempting: true },
    { name: 'Extra Reach', cost: 15, key: 'extraReach', tempting: true },
  ],
}

export const config = {
  topStripMode: 'narrative',
  bottomStripMode: 'shop',
  narrativeText: '🌟 Everything you need, you already have. Work beats wealth.',
  multiRound: true,
  shop,
  penaltyOnPurchase: true,
}