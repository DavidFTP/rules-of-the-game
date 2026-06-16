import React from 'react'
import styles from './BottomStrip.module.css'
import { useLanguage } from '../../i18n/LanguageContext.jsx'

export default function BottomStrip({ config, state, tokenBag, purchases, onBuy, levelNum, roundIndex, totalRounds, moves }) {
  // Hub — empty strip
  if (!config) {
    return <div className={styles.strip} />
  }
  if (config.bottomStripMode === 'shop') {
    return (
      <ShopStrip
        config={config}
        tokenBag={tokenBag}
        purchases={purchases}
        onBuy={onBuy}
      />
    )
  }
  return <TokensStrip tokens={state?.tokens ?? 0} levelNum={levelNum} roundIndex={roundIndex} totalRounds={totalRounds} moves={moves} />
}

function TokensStrip({ tokens, levelNum, roundIndex, totalRounds, moves }) {
  const { t } = useLanguage()
  const isLevel6 = false // level6 uses custom handling elsewhere
  const displayRound = isLevel6 ? (roundIndex > 0 ? 2 : 1) : ((roundIndex ?? 0) + 1)
  const displayTotal = isLevel6 ? 2 : totalRounds

  return (
    <div className={styles.strip}>
      <div className={styles.statGroup}>
        <div className={styles.statRow}>
          <span className={styles.statLabel}>{t('bottomStrip.level')}</span>
          <span className={styles.statValue}>{levelNum}</span>
        </div>
        {displayTotal > 1 && (
          <>
            <span className={styles.statLabel} style={{ marginTop: '3px' }}>{t('bottomStrip.round')}</span>
            <span className={styles.statValue} style={{ fontSize: '0.85em' }}>{displayRound}/{displayTotal}</span>
          </>
        )}
      </div>

      <div className={styles.statGroup}>
        <span className={styles.statLabel}>{t('bottomStrip.tokens')}</span>
        <span className={styles.statValue}>{tokens}</span>
      </div>

      <div className={styles.statGroup} style={{ marginInlineStart: 'auto' }}>
        <span className={styles.statLabel}>{t('bottomStrip.moves')}</span>
        <span className={styles.statValue}>{moves ?? 0}</span>
      </div>
    </div>
  )
}

function ShopStrip({ config, tokenBag, purchases, onBuy }) {
  const { t } = useLanguage()
  const shop = config.shop ?? {}
  const allItems = [
    ...(shop.red   ?? []),
    ...(shop.blue  ?? []),
    ...(shop.items ?? []),
  ]

  return (
    <div className={styles.strip}>
      <span className={styles.label}>{t('bottomStrip.shop')}</span>
      {allItems.map(item => {
        const bought    = purchases?.[item.key]
        const currency  = item.currency ?? 'gold'
        const balance   = tokenBag?.[currency] ?? 0
        const affordable = balance >= item.cost
        return (
          <div
            key={item.key}
            className={`${styles.badge} ${item.tempting ? styles.tempting : ''}`}
          >
            <span>{t(item.nameKey ?? item.name)}</span>
            <button
              className={`${styles.buyBtn} ${bought ? styles.bought : ''}`}
              disabled={!affordable || !!bought}
              onClick={() => onBuy?.(item)}
            >
              {bought ? '✓' : `${item.cost}🪙`}
            </button>
          </div>
        )
      })}
      <span className={styles.hint} style={{ marginInlineStart: 'auto' }}>
        {Object.entries(tokenBag ?? {})
          .filter(([, v]) => v > 0)
          .map(([k, v]) => `${k}: ${v}`)
          .join('  |  ')}
      </span>
    </div>
  )
}