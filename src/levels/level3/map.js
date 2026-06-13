// ==========================================
// ROUND 1: Solo maneuver
// Players must navigate around the central wall.
// ==========================================
export const map1 = [
  '#########',
  '#...T...#',
  '#.####..#',
  '#.......#',
  '#...B...#',
  '#.......#',
  '#..P.2..#',
  '#########',
]

// ==========================================
// ROUND 2: The Heavy Corner
// Requires pushing the heavy box into the open,
// then players must walk around it to push it up,
// and finally maneuver to its right to push it left into the target.
// ==========================================
export const map2 = [
  '###########',
  '#....T....#',
  '#..####...#',
  '#.........#',
  '#......H..#',
  '#.........#',
  '#...P..2..#',
  '###########',
]

// ==========================================
// ROUND 3: Double Trouble
// Two heavy boxes and two targets separated by walls.
// Players must coordinate to solve one side without trapping
// the other box against the boundaries.
// ==========================================
export const map3 = [
  '#############',
  '#...T...T.. #',
  '#...#...#.. #',
  '#.......... #',
  '#..H.....H. #',
  '#.......... #',
  '#...P...2.. #',
  '#############',
]