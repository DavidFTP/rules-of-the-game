import React from 'react'
import styles from './BottomStrip.module.css'
import { useLanguage } from '../../i18n/LanguageContext.jsx'

export default function BottomStrip({ config, state, tokenBag, purchases, onBuy }) {
  if (!config || config.bottomStripMode === 'tokens') {
    return <TokensStrip tokens={state?.tokens ?? 0} />
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
  return <TokensStrip tokens={state?.tokens ?? 0} />
}

function TokensStrip({ tokens }) {
  const { t } = useLanguage()
  return (
    <div className={styles.strip}>
      <span className={styles.label}>{t('bottomStrip.tokens')}</span>
      <div className={styles.badge}>
        <span className={styles.icon}>🪙</span>
        <span>{tokens}</span>
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