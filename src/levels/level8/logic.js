// Level 8 — Hard Sokoban + Unlocking Hints
// A genuinely hard puzzle. Hints unlock in the top strip after
// each restart threshold is crossed.

export const map = [
  '##############',
  '#............#',
  '#.T..T..T....#',
  '#............#',
  '#.B..........#',
  '#....B.......#',
  '#.......B....#',
  '#.......P....#',
  '#............#',
  '##############',
]

export const playerStart = { r: 7, c: 8 }

export const config = {
  topStripMode: 'hints',
  bottomStripMode: 'tokens',
  hintThreshold: 3,    // show first hint after 3 restarts
  hints: [
    'Think about which box to move first — the order matters.',
    'Try working from the bottom-left corner upward.',
    'The rightmost box needs the most room. Move it last.',
    'Clear a path for the middle box before touching the others.',
  ],
}