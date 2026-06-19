import { T } from './constants.js'

/**
 * parseMap(mapLines, overrides)
 *
 * Map character legend:
 *   '#'  wall
 *   '.'  floor
 *   'T'  target
 *   'B'  box (default type 'green')
 *   'P'  player 1 start
 *   '2'  player 2 start
 *   'C'  crack tile
 *   'S'  light switch
 *   '$'  coin / token pickup (alone → default currency from config)
 *   '$b' blue coin, '$r' red coin, '$g' green coin, '$k' darkcoin
 *   'O'  box already on target (pre-solved)
 *   ' '  void / outside level (not drawn, impassable)
 *   'G'  gate
 *   'D'  destructible wall (looks like a normal wall but can be destroyed by the player)
 *   'E'  door
 *
 * overrides: { boxes, targets, playerStart, player2Start }
 * These let a level's logic.js replace the map-parsed values
 * with richer metadata (box type, value, etc.)
 */
export function parseMap(mapLines, overrides = {}) {
  const grid      = []
  const boxes     = []
  const targets   = []
  const specials  = []
  let playerPos   = null
  let player2Pos  = null

  mapLines.forEach((line, r) => {
    const row = []
    for (let c = 0; c < line.length; c++) {
      const ch = line[c]
      switch (ch) {
        case '#':
          row.push(T.WALL)
          break
        case 'T':
          row.push(T.TARGET)
          // Targets now carry a `type` so logic and rendering can match
          // against box types. Default to 'green' (matches box default).
          targets.push({ r, c, type: 'green' })
          break
        case 'B':
          row.push(T.FLOOR)
          boxes.push({ r, c, type: 'green', id: `box-${r}-${c}` })
          break
        case 'H': 
          row.push(T.FLOOR)
          boxes.push({ r, c, type: 'red', id: `box-${r}-${c}`, isHeavy: true })
          break
        case 'O':
          row.push(T.TARGET)
          targets.push({ r, c, type: 'green' })
          boxes.push({ r, c, type: 'green', id: `box-${r}-${c}`, onTarget: true })
          break
        case 'P':
          row.push(T.FLOOR)
          playerPos = { r, c, dir: 'down' }
          break
        case '2':
          row.push(T.FLOOR)
          player2Pos = { r, c, dir: 'down' }
          break
        case 'C':
          row.push(T.CRACK)
          break
        case 'S':
          row.push(T.SWITCH)
          specials.push({ r, c, type: 'switch', active: false })
          break
        case '$':
          row.push(T.FLOOR)
          const coinCol = c
          const peek = line[c + 1]
          if (peek && /^[brgk]$/i.test(peek)) {
            const currencyMap = { b: 'blue', r: 'red', g: 'green', k: 'darkcoin' }
            c++
            row.push(T.FLOOR)
            specials.push({ r, c: coinCol, type: 'coin', amount: 10, currency: currencyMap[peek.toLowerCase()] })
          } else {
            specials.push({ r, c: coinCol, type: 'coin', amount: 10 })
          }
          break
        case 'G':
          row.push(T.WALL) 
          specials.push({ r, c, type: 'gate' })
          break
        case 'D':
          row.push(T.WALL) // Make it solid like a normal wall
          specials.push({ r, c, type: 'destructible' }) // Flag it so we can break it!
          break
        case 'E':
          row.push(0); // 0 means walkable floor
          specials.push({ r, c, type: 'door' });
          break;
        case ' ':
          row.push(T.VOID)
          break
        default:
          row.push(T.FLOOR)
      }
    }
    grid.push(row)
  })

  // Normalise grid to a rectangle: find max columns and pad shorter rows with VOID.
  // This keeps the renderer safe (no jagged arrays) and ensures the canvas is sized correctly.
  const maxCols = Math.max(...grid.map(r => r.length))
  grid.forEach(row => {
    while (row.length < maxCols) row.push(T.VOID)
  })

  // Normalize override-provided boxes/targets so they always include a `type`.
  const resolvedBoxes = (overrides.boxes ?? boxes).map(b => ({ ...b, type: b.type ?? 'green' }))
  const resolvedTargets = (overrides.targets ?? targets).map(t => ({ ...t, type: t.type ?? 'green' }))

  return {
    grid,
    playerPos:   overrides.playerStart   ?? playerPos,
    player2Pos:  overrides.player2Start  ?? player2Pos,
    boxes:       resolvedBoxes,
    targets:     resolvedTargets,
    specials,
    moves:       0,
    tokenBag:    {},
    fogLifted:   false,
    simonStep:   0,
  }
}