import { choiceMap, leftPuzzleMap, rightPuzzleMap } from './map.js';

export const config = {
  theme: 'level6',
  topStripMode: 'council',
  bottomStripMode: 'tokens',
  coop: false,
  hasTutorialButton: false,
  enforceOrder: true,

  councilTexts: {
    intro: {
      left: 'level6.council.intro.left',
      right: 'level6.council.intro.right'
    },
    world: {
      left: 'level6.council.world.left',
      right: 'level6.council.world.right'
    },
    truth: {
      left: 'level6.council.truth.left',
      right: 'level6.council.truth.right'
    }
  }
};

export const rounds = [
  {
    map: choiceMap,
    playerStart: { r: 3, c: 6 }
  },
  {
    map: leftPuzzleMap,
    boxes: [
      { r: 4, c: 3, type: 'red', id: 'l-red' },
      { r: 4, c: 6, type: 'blue', id: 'l-blue' }
    ],
    targets: [{ r: 2, c: 2 }, { r: 2, c: 7 }],
    playerStart: { r: 5, c: 4 }
  },
  {
    map: rightPuzzleMap,
    boxes: [
      { r: 4, c: 3, type: 'red', id: 'r-red' },
      { r: 4, c: 8, type: 'blue', id: 'r-blue' }
    ],
    targets: [{ r: 2, c: 3 }, { r: 2, c: 8 }],
    playerStart: { r: 5, c: 5 }
  },
];
