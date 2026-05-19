// Level 5 — Simon Says
// The top strip shows a sequence of moves. Player must follow them exactly.
// The sequence looks illogical but is the only path to win.

export const map = [
  '###########',
  '#.........#',
  '#....T....#',
  '#.........#',
  '#.........#',
  '#....B....#',
  '#....P....#',
  '#.........#',
  '###########',
]

export const playerStart = { r: 6, c: 5 }

export const config = {
  topStripMode: 'simon',
  bottomStripMode: 'tokens',
  // The sequence that actually wins the level.
  // Arrows shown in the strip, player must follow exactly.
  simonSequence: [
    'ArrowLeft', 'ArrowLeft', 'ArrowUp',
    'ArrowRight', 'ArrowRight', 'ArrowUp',
    'ArrowUp', 'ArrowLeft',
  ],
}