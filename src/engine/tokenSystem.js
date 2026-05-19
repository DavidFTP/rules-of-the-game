/**
 * tokenSystem.js
 * Manages one or more token currencies.
 * State shape for tokens:
 *   state.tokenBag = { gold: 0, red: 0, blue: 0, strength: 0 }
 */

export function emptyBag() {
  return { gold: 0, red: 0, blue: 0, strength: 0 }
}

export function earnTokens(bag, type, amount) {
  return { ...bag, [type]: (bag[type] ?? 0) + amount }
}

export function spendTokens(bag, type, amount) {
  const current = bag[type] ?? 0
  if (current < amount) return null  // insufficient
  return { ...bag, [type]: current - amount }
}

export function getBalance(bag, type) {
  return bag[type] ?? 0
}

export function canAfford(bag, type, cost) {
  return (bag[type] ?? 0) >= cost
}