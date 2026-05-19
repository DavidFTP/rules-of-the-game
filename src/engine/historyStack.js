const MAX_HISTORY = 100

/**
 * push(history, state) — returns new history array (immutable)
 * pop(history)         — returns { prev: state, history: newHistory }
 */

export function pushHistory(history, state) {
  const next = [...history, state]
  if (next.length > MAX_HISTORY) next.shift()
  return next
}

export function popHistory(history) {
  if (history.length === 0) return { prev: null, history }
  const next = [...history]
  const prev = next.pop()
  return { prev, history: next }
}