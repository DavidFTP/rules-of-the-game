// W = Wall (#), P = Player, B = Box, T = Target, '.' = Floor

// Round 1: The Trap of the Obvious Path
// Pushing straight up gets the box stuck. They MUST go left, up, right, then down.
export const lvl1_rnd1 = [
  '########',
  '#......#',
  '#..B...#',
  '#..P...#',
  '#..##T.#',
  '########',
];

// Round 2: Narrow Corridors
// Two boxes. Pushing the bottom box up immediately blocks the path for the top box.
export const lvl1_rnd2 = [
  '##########',
  '#...#..T.#',
  '#...#....#',
  '#.B......#',
  '#.#.#..B.#',
  '#.T.#..P.#',
  '##########',
];

// Round 3: The Clue Test
// Three boxes. Grey must go last. If they push Grey (closest to them) straight up, 
// it blocks the corridor for the other boxes.
export const lvl1_rnd3 = [
  '##############',
  '#............#',
  '#.#..T..T..T.#',
  '#.#..........#',
  '#.####..###..#',
  '#..B..B..B...#',
  '#.....P......#',
  '##############',
];