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
 *   '$'  coin / token pickup
 *   'O'  box already on target (pre-solved)
 *   ' '  floor (space also treated as floor)
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
          targets.push({ r, c })
          break
        case 'B':
          row.push(T.FLOOR)
          boxes.push({ r, c, type: 'green', id: `box-${r}-${c}` })
          break
        case 'O':
          row.push(T.TARGET)
          targets.push({ r, c })
          boxes.push({ r, c, type: 'green', id: `box-${r}-${c}`, onTarget: true })
          break
        case 'P':
          row.push(T.FLOOR)
          playerPos = { r, c }
          break
        case '2':
          row.push(T.FLOOR)
          player2Pos = { r, c }
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
          specials.push({ r, c, type: 'coin', amount: 10 })
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
        default:
          row.push(T.FLOOR)
      }
    }
    grid.push(row)
  })

  return {
    grid,
    playerPos:   overrides.playerStart   ?? playerPos,
    player2Pos:  overrides.player2Start  ?? player2Pos,
    boxes:       overrides.boxes         ?? boxes,
    targets:     overrides.targets       ?? targets,
    specials,
    moves:       0,
    tokens:      0,
    fogLifted:   false,
    simonStep:   0,
  }
}