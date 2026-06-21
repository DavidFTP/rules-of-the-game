const rawMap = [
  '###################################################',
  '#.................................................#',
  '#.................................................#',
  '#....D1.......D2.......D3.......D4.......D5......# ',
  '#.................................................#',
  '#.................................................#',
  '#........................P........................#',
  '#.................................................#',
  '#.................................................#',
  '#....D6.......D7.......D8.......D9.......DA......# ',
  '#.................................................#',
  '#.................................................#',
  '###################################################',
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
  { id: 1,  col: 5,  row: 3,  labelKey: 'door.label'  },
  { id: 2,  col: 14, row: 3,  labelKey: 'door.label'  },
  { id: 3,  col: 23, row: 3,  labelKey: 'door.label'  },
  { id: 4,  col: 32, row: 3,  labelKey: 'door.label'  },
  { id: 5,  col: 41, row: 3,  labelKey: 'door.label'  },
  { id: 6,  col: 5,  row: 9,  labelKey: 'door.label'  },
  { id: 7,  col: 14, row: 9,  labelKey: 'door.label'  },
  { id: 8,  col: 23, row: 9,  labelKey: 'door.label'  },
  { id: 9,  col: 32, row: 9,  labelKey: 'door.label'  },
  { id: 10, col: 41, row: 9,  labelKey: 'door.label' },
]

export const hubPlayerStart = { r: 6, c: 25 }
