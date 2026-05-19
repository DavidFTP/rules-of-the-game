// spriteConfig.js
// Describes where each tile lives inside sokoban_spritesheet_2.png
// The sheet is 1110×1110px with a 10×10 grid = 111px per tile.
// Coordinates are [col, row] (0-based).

export const SPRITE_SHEET = 'sokoban_spritesheet_2.png'
export const TILE_W = 111
export const TILE_H = 111
export const SHEET_COLS = 10
export const SHEET_ROWS = 10

// Named tile → [col, row] in the sheet
export const TILES = {
  // Floors / walls
  floor:          [7, 0],
  wall:           [5, 0],
  wallRed:        [5, 1],
  crackFloor:     [2, 2],
  switchOff:      [7, 4],
  switchOn:       [7, 3],

  // Targets (diamond gems)
  targetGreen:    [7, 9],
  targetBlue:     [7, 8],
  targetRed:      [7, 7],
  targetGold:     [7, 6],

  // Boxes — normal
  boxGreen:       [0, 0],
  boxBlue:        [0, 1],
  boxRed:         [0, 2],
  boxGrey:        [0, 4],
  boxBrown:       [0, 3],
  boxGold:        [1, 3],
  boxSilver:      [1, 4],

  // Boxes — on target (lit up)
  boxGreenOn:     [1, 0],
  boxBlueOn:      [1, 1],
  boxRedOn:       [1, 2],

  // Collectibles
  coin:           [8, 3],

  // Player 1 (red hat) — [col, row] pairs for each facing direction
  p1Down:         [8, 0],
  p1Up:           [8, 2],
  p1Left:         [8, 4],
  p1Right:        [8, 6],
  // walk frames
  p1DownWalk:     [9, 0],
  p1UpWalk:       [9, 2],
  p1LeftWalk:     [9, 4],
  p1RightWalk:    [9, 6],

  // Player 2 (green hat)
  p2Down:         [8, 1],
  p2Up:           [8, 3],
  p2Left:         [8, 5],
  p2Right:        [8, 7],
  p2DownWalk:     [9, 1],
  p2UpWalk:       [9, 3],
  p2LeftWalk:     [9, 5],
  p2RightWalk:    [9, 7],
}

// Maps a box's type string to the correct sprite tile name
export function boxTile(type, onTarget = false) {
  if (onTarget) {
    const map = { green: 'boxGreenOn', blue: 'boxBlueOn', red: 'boxRedOn' }
    return map[type] ?? 'boxGreenOn'
  }
  const map = {
    green:  'boxGreen',
    blue:   'boxBlue',
    red:    'boxRed',
    grey:   'boxGrey',
    brown:  'boxBrown',
    gold:   'boxGold',
    silver: 'boxSilver',
  }
  return map[type] ?? 'boxGreen'
}

// Maps direction + player number to the correct sprite tile name
export function playerTile(dir, playerNum = 1, walking = false) {
  const prefix = playerNum === 2 ? 'p2' : 'p1'
  const suffix = walking ? 'Walk' : ''
  const d = dir.charAt(0).toUpperCase() + dir.slice(1)
  return `${prefix}${d}${suffix}`
}