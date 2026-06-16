import React from 'react'
import styles from './BottomStrip.module.css'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { ASSET_PATHS } from '../../config/spriteConfig.js'

export default function BottomStrip({ config, state, tokenBag, purchases, onBuy, levelNum, roundIndex, totalRounds, moves, powerups, activePowerups, onActivatePowerup, isFinalRound }) {
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
  return (
    <TokensStrip
      tokenBag={state?.tokenBag ?? {}}
      levelNum={levelNum}
      roundIndex={roundIndex}
      totalRounds={totalRounds}
      moves={moves}
      powerups={powerups}
      activePowerups={activePowerups}
      onActivatePowerup={onActivatePowerup}
      isFinalRound={isFinalRound}
    />
  )
}

function CurrencyIcon({ type, className }) {
  const src = ASSET_PATHS.currency?.[type]
  return src ? <img src={src} alt="" className={className ?? styles.tokenIcon} /> : null
}

function TokensStrip({ tokenBag, levelNum, roundIndex, totalRounds, moves, powerups, activePowerups, onActivatePowerup, isFinalRound }) {
  const { t } = useLanguage()
  const isLevel6 = false // level6 uses custom handling elsewhere
  const displayRound = isLevel6 ? (roundIndex > 0 ? 2 : 1) : ((roundIndex ?? 0) + 1)
  const displayTotal = isLevel6 ? 2 : totalRounds

  const entries = Object.entries(tokenBag).filter(([, v]) => v > 0)
  const showPowerups = powerups && isFinalRound

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
        {entries.length === 0 ? (
          <span className={styles.statValue}>0</span>
        ) : (
          entries.map(([cur, amt]) => (
            <div key={cur} className={styles.tokenRow}>
              <CurrencyIcon type={cur} />
              <span className={styles.statValue}>{amt}</span>
            </div>
          ))
        )}
      </div>

      {showPowerups && powerups.map(pwr => {
        const isActive = activePowerups?.includes(pwr.id)
        const bagBlue = tokenBag['blue'] ?? 0
        const canAfford = bagBlue >= pwr.cost
        return (
          <div key={pwr.id} className={`${styles.powerupBadge} ${canAfford ? styles.tempting : ''}`}>
            <span className={styles.powerupName}>{t(pwr.nameKey ?? pwr.name)}</span>
            <button
              className={`${styles.buyBtn} ${isActive ? styles.bought : ''}`}
              disabled={isActive || !canAfford}
              onClick={() => onActivatePowerup?.(pwr.id, pwr.cost)}
            >
              {isActive ? '✓' : <><CurrencyIcon type="blue" className={styles.shopIcon} />{pwr.cost}</>}
            </button>
          </div>
        )
      })}

      <div className={styles.statGroup} style={{ marginInlineStart: showPowerups ? '0' : 'auto' }}>
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
        const currency  = item.currency ?? 'blue'
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
              {bought ? '✓' : <><CurrencyIcon type={currency} className={styles.shopIcon} />{item.cost}</>}
            </button>
          </div>
        )
      })}
      <span className={styles.hint} style={{ marginInlineStart: 'auto' }}>
        {Object.entries(tokenBag ?? {})
          .filter(([, v]) => v > 0)
          .map(([k, v]) => <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginInlineEnd: 6 }}><CurrencyIcon type={k} />{v}</span>)}
      </span>
    </div>
  )
}