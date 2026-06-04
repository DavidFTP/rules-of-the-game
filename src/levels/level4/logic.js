import { r1Map, r2Map, r3Map, bossMap } from './map.js';

export const config = {
  theme: 'level4', 
  topStripMode: 'marquee',
  bottomStripMode: 'tokens',
  coop: false,
  hasTutorialButton: true,
  tutorialSegments: [
    "Welcome to Level 4! Today's hero is Gideon.",
    "Gideon saw himself as weak, but God made him a mighty man of valor!",
    "⚠️ NEW MECHANIC: Gather strength (coins) in the early rounds.",
    "In the final round, use the Powerup Menu at the bottom to spend your strength on Super Push or Wall Bombs!"
  ],
  enforceOrder: false,
  
  // 💡 NEW: Dynamic Powerups Menu!
  powerups: [
    { id: 'superPush', name: '💪 Super Push', cost: 40, desc: 'Push 2 boxes (lasts all round)' },
    { id: 'bomb', name: '💣 Wall Bomb', cost: 20, desc: 'Destroy all cracked walls' }
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
      { r: 2, c: 5 }, // Blocked by D!
      { r: 2, c: 7 },
    ],
    playerStart: { r: 6, c: 5 },
    isFinal: true,
  },
];