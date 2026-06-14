export const rounds = [
  {
    map: [
      '#############',
      '#...........#',
      '#.T..T..T...#',
      '#...........#',
      '#.B..B..B...#',
      '#.........X.#',
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
      '#.B..B.......#',
      '#............#',
      '#.B..........#',
      '#......P.....#',
      '#............#',
      '##############',
    ],
    isFinal: true,
    penaltyOnPurchase: true,
    playerStart: { r: 7, c: 7 },
  },
]

export const shop = {
  items: [
    { nameKey: 'level10.shop.0.name', cost: 10, key: 'easyPush',   tempting: true },
    { nameKey: 'level10.shop.1.name', cost: 10, key: 'superSpeed', tempting: true },
    { nameKey: 'level10.shop.2.name', cost: 15, key: 'extraReach', tempting: true },
  ],
}

export const config = {
  topStripMode: 'narrative',
  bottomStripMode: 'shop',
  narrativeKey: 'level10.narrative',
  multiRound: true,
  shop,
  penaltyOnPurchase: true,
}
