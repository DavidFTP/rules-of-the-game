import * as level1  from './level1/logic.js'
import * as level2  from './level2/logic.js'
import * as level3  from './level3/logic.js'
import * as level4  from './level4/logic.js'
import * as level5  from './level5/logic.js'
import * as level6  from './level6/logic.js'
import * as level7  from './level7/logic.js'
import * as level8  from './level8/logic.js'
import * as level9  from './level9/logic.js'
import * as level10 from './level10/logic.js'

// Each level exports: map (or rounds), config, and optional overrides
// (boxes, targets, playerStart, player2Start).
// The engine and hooks read this registry — never import level files directly.
const LEVELS = {
  1:  level1,
  2:  level2,
  3:  level3,
  4:  level4,
  5:  level5,
  6:  level6,
  7:  level7,
  8:  level8,
  9:  level9,
  10: level10,
}

export default LEVELS