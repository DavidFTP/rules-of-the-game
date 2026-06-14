import { round1Map, round2Map, round3Map } from './map.js';

export const config = {
  theme: 'level1',
  topStripMode: 'marquee',
  bottomStripMode: 'tokens',
  hasTutorialButton: true,
  tutorialKey: 'level1.tutorial',
  tutorialSegments: [
    'level1.tutorial.0',
    'level1.tutorial.1',
    'level1.tutorial.2',
    'level1.tutorial.3',
    'level1.tutorial.4',
    'level1.tutorial.5',
    'level1.tutorial.6',
    'CLUE',
    'level1.tutorial.7',
  ],
};

export const rounds = [
  {
    map: round1Map,
    playerStart: { r: 3, c: 3 },
  },
  {
    map: round2Map,
    boxes: [
      { r: 3, c: 2, type: 'brown', id: 'r2-green' },
      { r: 4, c: 7,  id: 'r2-blue'  },
    ],
    targets: [
      { r: 1, c: 7 },
      { r: 5, c: 1 },
    ],
    playerStart: { r: 5, c: 7 },
  },
  {
    map: round3Map,
    boxes: [
      { r: 5, c: 3,  type: 'blue',  id: 'r3-blue'  },
      { r: 5, c: 6,  type: 'grey',  id: 'r3-grey'  },
      { r: 5, c: 9,  type: 'green', id: 'r3-green' },
    ],
    targets: [
      { r: 2, c: 5 },
      { r: 2, c: 8 },
      { r: 2, c: 11 },
    ],
    playerStart: { r: 6, c: 6 },
    config: {
      enforceOrder: true,
      requiredOrder: ['blue', 'green', 'grey'],
    },
    isFinal: true,
  },
];
