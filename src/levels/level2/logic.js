import { level2Map } from './map.js';

export const config = {
  theme: 'level2',
  topStripMode: 'marquee',
  bottomStripMode: 'tokens',
  hasTutorialButton: true,
  tutorialKey: 'level2.tutorial',
  tutorialSegments: [
    'level2.tutorial.0',
    'level2.tutorial.1',
    'level2.tutorial.2',
    'level2.tutorial.3',
  ],
  enforceOrder: false,
  fogOfWar: true,
  fogRadius: 1,
};

export const rounds = [
  {
    map: level2Map,
    boxes: [
      { r: 4, c: 9},
      { r: 4, c: 11},
      { r: 4, c: 13},
    ],
    targets: [
      { r: 2, c: 9 },
      { r: 2, c: 11 },
      { r: 2, c: 13 },
    ],
    switches: [
      { r: 1, c: 1, id: 'light-switch' }
    ],
    playerStart: { r: 6, c: 2 },
    isFinal: true,
  },
];
