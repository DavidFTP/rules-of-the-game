import { useState, useCallback } from 'react'
import { emptyBag, earnTokens, spendTokens, canAfford } from '../engine/tokenSystem.js'

export function useTokens(initialBag = null) {
  const [bag, setBag] = useState(initialBag ?? emptyBag())
  const [purchases, setPurchases] = useState({})

  const earn = useCallback((type, amount) => {
    setBag(b => earnTokens(b, type, amount))
  }, [])

  const buy = useCallback((item) => {
    if (purchases[item.key]) return false
    setBag(b => {
      const next = spendTokens(b, item.currency ?? 'gold', item.cost)
      if (!next) return b
      setPurchases(p => ({ ...p, [item.key]: true }))
      return next
    })
  }, [purchases])

  const hasPurchased = useCallback((key) => !!purchases[key], [purchases])

  const affordable = useCallback((item) =>
    canAfford(bag, item.currency ?? 'gold', item.cost), [bag])

  return { bag, earn, buy, hasPurchased, affordable, purchases }
}