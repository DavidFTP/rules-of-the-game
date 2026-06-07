import { r1Map, r2Map, r3Map } from './map.js';

export const config = {
  theme: 'level5', 
  topStripMode: 'simon', // Activates the Simon Says engine globally for this level!
  bottomStripMode: 'tokens',
  coop: false,
  hasTutorialButton: true,
  tutorialSegments: [
    "Welcome to Level 5! Today's hero is Naaman.",
    "Naaman was told to wash in the river 7 times to be healed. He thought it was silly and illogical!",
    "Sometimes, God's instructions don't make sense to us at first, but obedience brings victory.",
    "⚠️ NEW RULE: You MUST follow the exact sequence of moves shown at the top of the screen. If you press the wrong key, you start the sequence over!"
  ],
  enforceOrder: false,
};

export const rounds = [
  // ROUND 1: A little illogical pacing
  {
    map: r1Map,
    boxes:   [{ r: 3, c: 4, type: 'green', id: 'l5-b1' }],
    targets: [{ r: 3, c: 6 }],
    playerStart: { r: 3, c: 2 },
    config: {
      // Step away, pace around, then finally push it
      simonSequence: ['ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowRight', 'ArrowRight','ArrowRight']
    }
  },
  
  // ROUND 2: The 7 Dips in the River
  {
    map: r2Map,
    boxes:   [{ r: 2, c: 3, type: 'green', id: 'l5-b2' }],
    targets: [{ r: 1, c: 3 }],
    playerStart: { r: 3, c: 3 },
    config: {
      // Pacing down and up 7 times to mirror Naaman dipping 7 times!
      simonSequence: [
        'ArrowDown', 'ArrowUp',   // Dip 1
        'ArrowDown', 'ArrowUp',   // Dip 2
        'ArrowDown', 'ArrowUp',   // Dip 3
        'ArrowDown', 'ArrowUp',   // Dip 4
        'ArrowDown', 'ArrowUp',   // Dip 5
        'ArrowDown', 'ArrowUp',   // Dip 6
        'ArrowDown', 'ArrowUp',   // Dip 7
        'ArrowUp'                 // Final push!
      ]
    }
  },
  
  // ROUND 3: The Scenic Route
  {
    map: r3Map,
    boxes:   [{ r: 3, c: 3, type: 'green', id: 'l5-b3' }],
    targets: [{ r: 1, c: 3 }],
    playerStart: { r: 4, c: 2 },
    isFinal: true,
    config: {
      // Forces them to walk a complete lap around the perimeter of the room 
      // before they are allowed to just push the box straight up.
      simonSequence: [
        'ArrowLeft', 'ArrowUp', 'ArrowUp', 'ArrowUp',                // Walk up the left wall
        'ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight', // Walk across the top wall
        'ArrowDown', 'ArrowDown', 'ArrowDown',                       // Walk down the right wall
        'ArrowLeft', 'ArrowLeft', 'ArrowLeft',                       // Walk back to the box
        'ArrowUp', 'ArrowUp'                                         // Push the box onto the target!
      ]
    }
  }
];