import { r1Map, r2Map, r3Map, bossMap } from './map.js';

export const config = {
  theme: 'level4',
  topStripMode: 'marquee',
  bottomStripMode: 'tokens',
  currency: 'blue',
  coop: false,
  hasTutorialButton: true,
  tutorialKey: 'level4.tutorial',
  tutorialSegments: [
    'level4.tutorial.0',
    'level4.tutorial.1',
    'level4.tutorial.2',
    'level4.tutorial.3',
  ],
  enforceOrder: false,

  powerups: [
    { id: 'superPush', nameKey: 'level4.powerup.superPush', cost: 40, desc: '' },
    { id: 'bomb', nameKey: 'level4.powerup.bomb', cost: 20, desc: '' },
  ]
};

export const rounds = [
  { map: r1Map, playerStart: { r: 3, c: 2 } },
  { map: r2Map, playerStart: { r: 4, c: 3 } },
  { map: r3Map, playerStart: { r: 3, c: 3 } },
  {
    map: bossMap,
    boxes: [
      { r: 5, c: 3, type: 'green', id: 'n1' },
      { r: 5, c: 7, type: 'green', id: 'n2' },
      { r: 5, c: 8, type: 'green', id: 'n3' },
    ],
    targets: [
      { r: 2, c: 3 },
      { r: 2, c: 5 },
      { r: 2, c: 7 },
    ],
    playerStart: { r: 6, c: 5 },
    isFinal: true,
  },
];
