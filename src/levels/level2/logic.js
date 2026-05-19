// Level 2 — Lights Out / Fog of War
// Player starts in darkness. Must find the switch (S) to lift the fog.
// Only then can they see the full level and solve it.

export const map = [
  '###############',
  '#.............#',
  '#..T...T...T..#',
  '#.............#',
  '#.............#',
  '#..B...B...B..#',
  '#.............#',
  '#.........S...#',
  '#.............#',
  '#.......P.....#',
  '#.............#',
  '###############',
]

export const playerStart = { r: 9, c: 8 }

export const config = {
  topStripMode: 'narrative',
  bottomStripMode: 'tokens',
  narrativeText: '🔦 The lights went out... find the switch to restore power.',
  fogOfWar: true,
  fogRadius: 2.5,
}