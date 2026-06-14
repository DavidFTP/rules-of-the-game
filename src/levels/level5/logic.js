import { r1Map, r2Map, r3Map } from './map.js';

export const config = {
  theme: 'level5',
  topStripMode: 'simon',
  bottomStripMode: 'tokens',
  coop: false,
  hasTutorialButton: true,
  tutorialKey: 'level5.tutorial',
  tutorialSegments: [
    'level5.tutorial.0',
    'level5.tutorial.1',
    'level5.tutorial.2',
    'level5.tutorial.3',
  ],
  enforceOrder: false,
};

export const rounds = [
  {
    map: r1Map,
    boxes:   [{ r: 3, c: 4}],
    targets: [{ r: 3, c: 6 }],
    playerStart: { r: 3, c: 2 },
    config: {
      simonSequence: ['ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowRight', 'ArrowRight','ArrowRight']
    }
  },
  {
    map: r2Map,
    boxes:   [{ r: 2, c: 3 }],
    targets: [{ r: 1, c: 3 }],
    playerStart: { r: 3, c: 3 },
    config: {
      simonSequence: [
        'ArrowDown', 'ArrowUp',
        'ArrowDown', 'ArrowUp',
        'ArrowDown', 'ArrowUp',
        'ArrowDown', 'ArrowUp',
        'ArrowDown', 'ArrowUp',
        'ArrowDown', 'ArrowUp',
        'ArrowDown', 'ArrowUp',
        'ArrowUp'
      ]
    }
  },
  {
    map: r3Map,
    boxes:   [{ r: 3, c: 3 }],
    targets: [{ r: 1, c: 3 }],
    playerStart: { r: 4, c: 2 },
    isFinal: true,
    config: {
      simonSequence: [
        'ArrowLeft', 'ArrowUp', 'ArrowUp', 'ArrowUp',
        'ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight',
        'ArrowDown', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowLeft', 'ArrowLeft',
        'ArrowUp', 'ArrowUp'
      ]
    }
  }
];
