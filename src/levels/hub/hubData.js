const rawMap = [
  '             ####### #######             ',
  '             #.....# #.....#             ',
  '             #.D7..# #..D4.#             ',
  '     ####### #.....# #.....# #######     ',
  '     #.....# #.....# #.....# #.....#     ',
  '     #.D1..# #.....# #.....# #..D9.#     ',
  '     #.....###.....###.....###.....#     ',
  '     #.....#.####.##.##.####.#.....#     ',
  '     #.....#.................#.....#     ',
  '     #.............................#     ',
  '############........P........############',
  '#..............................#........#',
  '#........#.....................#.....D2.#',
  '#........#.....................#........#',
  '#.D6.....#.....................#........#',
  '#........#..............................#',
  '############.................############',
  '     #.............................#     ',
  '     #.....#.................#.....#     ',
  '     #.....#.####.##.##.####.#.....#     ',
  '     #.....###.....###.....###.....#     ',
  '     #.D8..# #.....# #.....# #..DA.#     ',
  '     #.....# #.....# #.....# #.....#     ',
  '     ####### #.....# #.....# #######     ',
  '             #.D5..# #..D3.#             ',
  '             #.....# #.....#             ',
  '             ####### #######             ',
]

/**
 * Normalize all rows to the same length by padding with spaces (void).
 * Mirrors how levelParser pads shorter rows with T.VOID.
 */
function normalizeMap(lines) {
  const grid = lines.map(line => [...line])
  const maxCols = Math.max(...grid.map(r => r.length))
  for (const row of grid) {
    while (row.length < maxCols) row.push(' ')
  }
  return grid
}

export const hubMap = rawMap
export const hubGrid = normalizeMap(rawMap)
export const HUB_COLS = hubGrid[0].length
export const HUB_ROWS = hubGrid.length

export const hubDoors = [
  { id: 1,  col: 7,  row: 5,  labelKey: 'door.label' },
  { id: 2,  col: 38, row: 12, labelKey: 'door.label' },
  { id: 3,  col: 25, row: 24, labelKey: 'door.label' },
  { id: 4,  col: 25, row: 2,  labelKey: 'door.label' },
  { id: 5,  col: 15, row: 24, labelKey: 'door.label' },
  { id: 6,  col: 2,  row: 14, labelKey: 'door.label' },
  { id: 7,  col: 15, row: 2,  labelKey: 'door.label' },
  { id: 8,  col: 7,  row: 21, labelKey: 'door.label' },
  { id: 9,  col: 33, row: 5,  labelKey: 'door.label' },
  { id: 10, col: 33, row: 21, labelKey: 'door.label' },
]

export const hubPlayerStart = {
  r: 12,
  c: 20
}
