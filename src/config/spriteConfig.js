// spriteConfig.js
// Describes where each tile lives inside sokoban_spritesheet_2.png
// The sheet is 1110×1110px with a 10×10 grid = 111px per tile.
// Coordinates are [col, row] (0-based).

// Asset-first configuration
export const ASSET_MODE = {
  ASSETS: 'assets',
  SHEET:  'sheet',
  NONE:   'none',
}

export const DEFAULT_ASSET_MODE = ASSET_MODE.ASSETS

// Map of helpful asset URLs (uses Vite-friendly new URL resolution)
export const ASSET_PATHS = {
  tiles: {
    floor: new URL('../assets/tiles/greyg.png', import.meta.url).href,
    wall:  new URL('../assets/tiles/redW2.png', import.meta.url).href,
    targetGround: new URL('../assets/tiles/greyGtarget.png', import.meta.url).href,
  },
  boxes: {
    default: new URL('../assets/crates/default.png', import.meta.url).href,
    blue:    new URL('../assets/crates/blue.png', import.meta.url).href,
    red:     new URL('../assets/crates/red.png', import.meta.url).href,
    grey:    new URL('../assets/crates/grey.png', import.meta.url).href,
    target:  new URL('../assets/crates/target.png', import.meta.url).href,
  },
  currency: {
    coin: new URL('../assets/currency/lightcoin.png', import.meta.url).href,
  },
  sprites: {
    front1:      new URL('../assets/sprites/front1.png', import.meta.url).href,
    front1_2:    new URL('../assets/sprites/front1_2.png', import.meta.url).href,
    front2:      new URL('../assets/sprites/front2.png', import.meta.url).href,
    front2_2:    new URL('../assets/sprites/front2_2.png', import.meta.url).href,
    frontStill:  new URL('../assets/sprites/frontStill.png', import.meta.url).href,
    frontStill_2:new URL('../assets/sprites/frontStill_2.png', import.meta.url).href,
    back1:       new URL('../assets/sprites/back1.png', import.meta.url).href,
    back1_2:     new URL('../assets/sprites/back1_2.png', import.meta.url).href,
    back2:       new URL('../assets/sprites/back2.png', import.meta.url).href,
    back2_2:     new URL('../assets/sprites/back2_2.png', import.meta.url).href,
    backStill:   new URL('../assets/sprites/backStill.png', import.meta.url).href,
    backStill_2: new URL('../assets/sprites/backStill_2.png', import.meta.url).href,
    left1:       new URL('../assets/sprites/left1.png', import.meta.url).href,
    left1_2:     new URL('../assets/sprites/left1_2.png', import.meta.url).href,
    left2:       new URL('../assets/sprites/left2.png', import.meta.url).href,
    left2_2:     new URL('../assets/sprites/left2_2.png', import.meta.url).href,
    leftStill:   new URL('../assets/sprites/leftStill.png', import.meta.url).href,
    leftStill_2: new URL('../assets/sprites/leftStill_2.png', import.meta.url).href,
    right1:      new URL('../assets/sprites/right1.png', import.meta.url).href,
    right1_2:    new URL('../assets/sprites/right1_2.png', import.meta.url).href,
    right2:      new URL('../assets/sprites/right2.png', import.meta.url).href,
    right2_2:    new URL('../assets/sprites/right2_2.png', import.meta.url).href,
    rightStill:  new URL('../assets/sprites/rightStill.png', import.meta.url).href,
    rightStill_2:new URL('../assets/sprites/rightStill_2.png', import.meta.url).href,
  }
}

// Preload images for quick usage in canvas rendering. Returns a Promise resolving
// to a map { tiles: {...}, boxes: {...}, sprites: {...}, currency: {...} }
export function loadAssets(onProgress = null) {
  const all = []
  const out = { tiles: {}, boxes: {}, sprites: {}, currency: {} }

  const push = (category, key, url) => {
    all.push({ category, key, url })
  }

  Object.entries(ASSET_PATHS.tiles).forEach(([k, v]) => push('tiles', k, v))
  Object.entries(ASSET_PATHS.boxes).forEach(([k, v]) => push('boxes', k, v))
  Object.entries(ASSET_PATHS.sprites).forEach(([k, v]) => push('sprites', k, v))
  Object.entries(ASSET_PATHS.currency).forEach(([k, v]) => push('currency', k, v))

  console.log('📦 loadAssets - loading', all.length, 'images, including:', all.filter(a => a.key === 'targetGround').map(a => a.url))

  let loaded = 0
  return Promise.all(all.map(item => new Promise(res => {
    const img = new Image()
    img.onload = () => {
      loaded++
      out[item.category][item.key] = img
      if (item.key === 'targetGround') console.log('✅ targetGround loaded successfully')
      if (typeof onProgress === 'function') onProgress(loaded, all.length, item)
      res()
    }
    img.onerror = () => {
      loaded++
      if (item.key === 'targetGround') console.log('❌ targetGround FAILED to load from:', item.url)
      // Leave the slot undefined so caller can fallback
      if (typeof onProgress === 'function') onProgress(loaded, all.length, item)
      res()
    }
    img.src = item.url
  }))).then(() => out)
}

// Helper: return a specific image (may be undefined if not loaded)
export function getAsset(map, path) {
  if (!map) return undefined
  const parts = path.split('.')
  let cur = map
  for (const p of parts) {
    cur = cur?.[p]
    if (cur === undefined) return undefined
  }
  return cur
}

// Map player direction ('up', 'down', 'left', 'right') to sprite key ('backStill', 'frontStill', etc.)
export function dirToSpriteKey(dir) {
  const dirMap = {
    up: 'backStill',
    down: 'frontStill',
    left: 'leftStill',
    right: 'rightStill',
  }
  return dirMap[dir] ?? 'frontStill'
}