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
    "God's word is a lamp to my feet and a light to my path."
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