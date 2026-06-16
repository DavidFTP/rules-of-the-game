import React from 'react'
import styles from './TopStrip.module.css'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import logoSrc from '../../assets/logo.png'

export default function TopStrip({ config, state, levelNum, restarts, roundIndex, totalRounds, onTutorialClick }) {
  const { t } = useLanguage()

  const isLevel6 = config?.theme === 'level6' || state?.config?.theme === 'level6'
  const displayTotal = isLevel6 ? 2 : totalRounds
  const displayRound = isLevel6 ? (roundIndex > 0 ? 2 : 1) : ((roundIndex ?? 0) + 1)

  const isClickable = !!config?.hasTutorialButton
  const isHub = !config

  if (isHub) {
    return (
      <div className={styles.strip}>
        <div className={styles.hubTitle}>
          <img src={logoSrc} alt="" className={styles.logo} />
          <span className={styles.hubTitleText}>{t('topStrip.rulesOfTheGame')}</span>
        </div>
        <div className={styles.spacer} />
        <LangToggle />
      </div>
    )
  }

  const renderCenter = () => {
    switch (config.topStripMode) {
      case 'marquee':  return <MarqueeStrip   config={config} />
      case 'narrative':return <NarrativeStrip config={config} />
      case 'council':  return <CouncilStrip   config={config} state={state} />
      case 'simon':    return <SimonStrip     config={config} state={state} />
      case 'hints':    return <HintsStrip     config={config} restarts={restarts} />
      default:         return <DefaultStrip   config={config} />
    }
  }

  return (
    <div className={styles.strip}>
      <div
        className={styles.centerArea}
        onClick={isClickable ? onTutorialClick : undefined}
        style={{ cursor: isClickable ? 'pointer' : 'default' }}
        title={isClickable ? t('levelScreen.levelRules') : ''}
      >
        {renderCenter()}
      </div>

      <div className={styles.sideCol}>
        <LangToggle />
      </div>
    </div>
  )
}

function LangToggle() {
  const { lang, toggleLang, t } = useLanguage()
  return (
    <button className={styles.langBtn} onClick={toggleLang} title={t('lang.toggle')}>
      {t('lang.label')}
    </button>
  )
}

function DefaultStrip({ config }) {
  const { t } = useLanguage()
  const segKeys = config?.tutorialSegments
  return (
    <span className={styles.text}>
      {segKeys ? t(segKeys[0]) : t('topStrip.defaultInstruction')}
    </span>
  )
}

function NarrativeStrip({ config }) {
  const { t } = useLanguage()
  const key = config?.narrativeKey
  return <span className={styles.text}>{key ? t(key) : ''}</span>
}

function MarqueeStrip({ config }) {
  const { t } = useLanguage()
  return (
    <div className={styles.marqueeWrap} style={{ justifyContent: 'center' }}>
      <span className={styles.readMe}>{t('topStrip.readMe')}</span>
    </div>
  )
}

function CouncilStrip({ config, state }) {
  const { t } = useLanguage()

  let leftKey = 'level6.council.intro.left'
  let rightKey = 'level6.council.intro.right'

  if (config?.theme === 'level6' && config.councilTexts) {
    if (state?.roundIndex === 0) {
      leftKey = config.councilTexts.intro.left
      rightKey = config.councilTexts.intro.right
    } else if (state?.chosenPath === 'left') {
      leftKey = config.councilTexts.world.left
      rightKey = config.councilTexts.world.right
    } else {
      leftKey = config.councilTexts.truth.left
      rightKey = config.councilTexts.truth.right
    }
  }

  const style = config?.theme === 'level6' ? {
    borderColor: '#666', color: '#eee', borderInlineStart: '3px solid #666', background: 'rgba(255,255,255,0.08)'
  } : {}

  return (
    <div className={styles.councilWrap}>
      <div className={`${styles.council} ${config?.theme === 'level6' ? '' : styles.worldCouncil}`} style={style}>
        <div className={styles.councilLabel}>{t('topStrip.voice1')}</div>{t(leftKey)}
      </div>
      <div className={`${styles.council} ${config?.theme === 'level6' ? '' : styles.truthCouncil}`} style={style}>
        <div className={styles.councilLabel}>{t('topStrip.voice2')}</div>{t(rightKey)}
      </div>
    </div>
  )
}

function SimonStrip({ config, state }) {
  const { t } = useLanguage()
  const activeConfig = state?.config || config
  const seq = activeConfig.simonSequence ?? []
  const done = state?.simonStep ?? 0
  const currentCommand = seq[done]
  const arrowNames = { ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT' }

  return (
    <span className={styles.text} style={{ fontWeight: 'bold', letterSpacing: '1px', color: '#FFD700', fontFamily: 'monospace', textAlign: 'center' }}>
      {currentCommand
        ? t('topStrip.next', { direction: arrowNames[currentCommand] || currentCommand })
        : t('topStrip.allDone')}
    </span>
  )
}

function HintsStrip({ config, restarts }) {
  const { t } = useLanguage()
  const threshold = config.hintThreshold ?? 3
  const hints = config.hints ?? []
  const hintIdx = Math.min(restarts - threshold, hints.length - 1)
  const showHint = restarts >= threshold && hintIdx >= 0

  return (
    <span className={styles.text}>
      {showHint
        ? <><strong>{t('topStrip.hintPrefix')}</strong> {t(hints[hintIdx])}</>
        : t('topStrip.defaultHint')}
    </span>
  )
}
