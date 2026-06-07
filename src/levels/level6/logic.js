import { choiceMap, leftPuzzleMap, rightPuzzleMap } from './map.js';

export const config = {
  theme: 'level6',
  topStripMode: 'council',
  bottomStripMode: 'tokens',
  coop: false,
  hasTutorialButton: false,
  enforceOrder: true,
  
  // Dynamic Council Texts
  councilTexts: {
    intro: {
      left: "Walk through the West Door. It is the logical path.",
      right: "Walk through the East Door. It is the true path."
    },
    world: {
      left: "Good. Now place RED first, then BLUE.",
      right: "You chose wrong. There is no turning back."
    },
    truth: {
      left: "You ignored us. You will regret it.",
      right: "Good. Now place BLUE first, then RED."
    }
  }
};

export const rounds = [
  // Round 0: The Choice Room
  {
    map: choiceMap,
    playerStart: { r: 3, c: 6 } // Start dead center
  },
  // Round 1: The Left Puzzle (World)
  {
    map: leftPuzzleMap,
    boxes: [
      { r: 4, c: 3, type: 'red', id: 'l-red' },
      { r: 4, c: 6, type: 'blue', id: 'l-blue' }
    ],
    targets: [{ r: 2, c: 2 }, { r: 2, c: 7 }],
    playerStart: { r: 5, c: 4 }
  },
  // Round 2: The Right Puzzle (Truth)
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