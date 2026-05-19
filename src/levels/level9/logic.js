// Level 9 — Red vs Blue Tokens / Shop
// Red boxes drop big red tokens. Blue boxes drop small blue tokens.
// The shop offers flashy red upgrades and modest blue ones.
// But only the blue upgrade lets you push the final round's special boxes.
// Lesson: don't chase what glitters.

export const rounds = [
  {
    map: [
      '############',
      '#..........#',
      '#..T....T..#',
      '#..........#',
      '#..Br...Bb.#',
      '#....P.....#',
      '#..........#',
      '############',
    ],
    boxes: [
      { r: 4, c: 3, type: 'red',  id: 'r1-red',  tokenType: 'red',  tokenAmount: 100 },
      { r: 4, c: 8, type: 'blue', id: 'r1-blue', tokenType: 'blue', tokenAmount: 50  },
    ],
    targets: [{ r: 2, c: 3 }, { r: 2, c: 8 }],
    playerStart: { r: 5, c: 5 },
  },
  {
    map: [
      '##############',
      '#............#',
      '#.T..T..T....#',
      '#............#',
      '#.Br.Bb.Bb...#',
      '#.....P......#',
      '#............#',
      '##############',
    ],
    boxes: [
      { r: 4, c: 2, type: 'red',  id: 'r2-red1', tokenType: 'red',  tokenAmount: 100 },
      { r: 4, c: 5, type: 'blue', id: 'r2-blue1',tokenType: 'blue', tokenAmount: 50  },
      { r: 4, c: 8, type: 'blue', id: 'r2-blue2',tokenType: 'blue', tokenAmount: 50  },
    ],
    targets: [{ r: 2, c: 2 }, { r: 2, c: 5 }, { r: 2, c: 8 }],
    playerStart: { r: 5, c: 6 },
    isFinal: true,
    // These boxes can only be pushed if player has blueStrength upgrade
    gatedBoxIds: ['r2-blue1', 'r2-blue2'],
    gateKey: 'blueStrength',
  },
]

export const shop = {
  red: [
    { name: '+100 Red Power', cost: 100, currency: 'red', key: 'redPower',  value: 100, tempting: true  },
    { name: '+250 Red Crit',  cost: 200, currency: 'red', key: 'redCrit',   value: 250, tempting: true  },
  ],
  blue: [
    { name: '+10 Blue Str',   cost: 50,  currency: 'blue', key: 'blueStrength', value: 10 },
    { name: '+15 Blue Speed', cost: 75,  currency: 'blue', key: 'blueSpeed',    value: 15 },
  ],
}

export const config = {
  topStripMode: 'narrative',
  bottomStripMode: 'shop',
  narrativeText: '🔵 Blue may look small... but it\'s the only thing that moves what matters.',
  multiRound: true,
  shop,
  finalGateKey: 'blueStrength',
}