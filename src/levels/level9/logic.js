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
    gatedBoxIds: ['r2-blue1', 'r2-blue2'],
    gateKey: 'blueStrength',
  },
]

export const shop = {
  red: [
    { nameKey: 'level9.shop.red.0.name', cost: 100, currency: 'red', key: 'redPower',  value: 100, tempting: true  },
    { nameKey: 'level9.shop.red.1.name', cost: 200, currency: 'red', key: 'redCrit',   value: 250, tempting: true  },
  ],
  blue: [
    { nameKey: 'level9.shop.blue.0.name', cost: 50,  currency: 'blue', key: 'blueStrength', value: 10 },
    { nameKey: 'level9.shop.blue.1.name', cost: 75,  currency: 'blue', key: 'blueSpeed',    value: 15 },
  ],
}

export const config = {
  topStripMode: 'narrative',
  bottomStripMode: 'shop',
  narrativeKey: 'level9.narrative',
  multiRound: true,
  shop,
  finalGateKey: 'blueStrength',
}
