import { lvl2_rnd1, lvl2_rnd2 } from './map.js';

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
    map: lvl2_rnd1,
    switches: [
      { r: 1, c: 1, id: 'light-switch' }
    ],
    // isFinal: true,
  },
  {
    map: lvl2_rnd2,
    isFinal: true,
  },
];
