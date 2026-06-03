import { level2Map } from './map.js';

export const config = {
  theme: 'level2', 
  topStripMode: 'marquee',
  bottomStripMode: 'tokens',
  hasTutorialButton: true,
  tutorialSegments: [
    "Welcome to Level 2!",
    "Sometimes the world is dark and we can't see the path clearly.",
    "Find the switch to turn on the light and open the gate.",
    "⚠️ NEW RULE: Make sure to place each box on the target with the MATCHING color!",
    "God's word is a lamp to my feet and a light to my path."
  ],
  enforceOrder: false,
  fogOfWar: true, 
  fogRadius: 1, 

  // 💡 CUSTOM WIN FUNCTION: Forces strict color matching!
  winFn: (state) => {
    const { targets, boxes } = state;
    // Every target must have a box of the exact same type/color on it
    return targets.every(t => 
      boxes.some(b => b.r === t.r && b.c === t.c && b.type === t.type)
    );
  }
};

export const rounds = [
  {
    map: level2Map,
    boxes: [
      { r: 4, c: 9,  type: 'blue', id: 'l2-blue'  },
      { r: 4, c: 11, type: 'grey', id: 'l2-grey'  },
      { r: 4, c: 13, type: 'green', id: 'l2-green' },
    ],
    // 💡 Add types to the targets to match the boxes!
    targets: [
      { r: 2, c: 9,  type: 'blue' },
      { r: 2, c: 11, type: 'grey' },
      { r: 2, c: 13, type: 'green' },
    ],
    switches: [
      { r: 1, c: 1, id: 'light-switch' }
    ],
    playerStart: { r: 6, c: 2 },
    isFinal: true,
  },
];