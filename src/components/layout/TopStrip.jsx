import React from 'react'
import styles from './TopStrip.module.css'

export default function TopStrip({ config, state, levelNum, restarts }) {
  if (!config) return <DefaultStrip levelNum={levelNum} state={state} />

  switch (config.topStripMode) {
    case 'marquee':  return <MarqueeStrip  config={config} state={state} levelNum={levelNum} />
    case 'narrative':return <NarrativeStrip config={config} state={state} levelNum={levelNum} />
    case 'council':  return <CouncilStrip  config={config} />
    case 'simon':    return <SimonStrip    config={config} state={state} levelNum={levelNum} />
    case 'hints':    return <HintsStrip    config={config} restarts={restarts} />
    default:         return <DefaultStrip  levelNum={levelNum} state={state} />
  }
}

function DefaultStrip({ levelNum, state }) {
  return (
    <div className={styles.strip}>
      <span className={styles.title}>{levelNum ? `LVL ${levelNum}` : 'THE WAY'}</span>
      <span className={styles.text}>Use arrow keys to move. Push boxes onto the targets.</span>
      <span className={styles.meta}>Moves: <em>{state?.moves ?? 0}</em></span>
    </div>
  )
}

function NarrativeStrip({ config, state, levelNum }) {
  return (
    <div className={styles.strip}>
      <span className={styles.title}>LVL {levelNum}</span>
      <span className={styles.text}>{config.narrativeText}</span>
      <span className={styles.meta}>Moves: <em>{state?.moves ?? 0}</em></span>
    </div>
  )
}

// Marquee: scrolling tutorial text with gold-highlighted clue
function MarqueeStrip({ config, state, levelNum }) {
  const segments = config.tutorialSegments ?? []
  return (
    <div className={styles.strip}>
      <span className={styles.title}>LVL {levelNum}</span>
      <div className={styles.marqueeWrap}>
        <div className={styles.marqueeTrack}>
          {segments.map((seg, i) =>
            seg === 'CLUE'
              ? <span key={i} className={styles.clue}>push the GREY box LAST</span>
              : <span key={i}>{seg}</span>
          )}
        </div>
      </div>
      <span className={styles.meta}>Moves: <em>{state?.moves ?? 0}</em></span>
    </div>
  )
}

// Council: two-column split for Level 6
function CouncilStrip({ config }) {
  return (
    <div className={`${styles.strip} ${styles.councilWrap}`}>
      <div className={`${styles.council} ${styles.worldCouncil}`}>
        <div className={styles.councilLabel}>THE WORLD SAYS</div>
        {config.council?.worldSays}
      </div>
      <div className={`${styles.council} ${styles.truthCouncil}`}>
        <div className={styles.councilLabel}>TRUTH SAYS</div>
        {config.council?.truthSays}
      </div>
    </div>
  )
}

// Simon: shows the sequence with colour-coded progress
function SimonStrip({ config, state, levelNum }) {
  const seq  = config.simonSequence ?? []
  const done = state?.simonStep ?? 0
  const arrowMap = {
    ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→'
  }
  return (
    <div className={styles.strip}>
      <span className={styles.title}>LVL {levelNum}</span>
      <div className={styles.simonSeq}>
        {seq.map((k, i) => (
          <span
            key={i}
            className={
              i < done    ? styles.simonDone  :
              i === done  ? styles.simonNext  :
              styles.simonPending
            }
          >
            {arrowMap[k] ?? k}
          </span>
        ))}
      </div>
      <span className={styles.meta}>Step: <em>{done}/{seq.length}</em></span>
    </div>
  )
}

// Hints: unlocks progressively after restarts
function HintsStrip({ config, restarts }) {
  const threshold = config.hintThreshold ?? 3
  const hints = config.hints ?? []
  const hintIdx = Math.min(restarts - threshold, hints.length - 1)
  const showHint = restarts >= threshold && hintIdx >= 0

  return (
    <div className={styles.strip}>
      <span className={styles.title}>LVL 8</span>
      <span className={styles.text}>
        {showHint
          ? <>💡 <strong>Hint:</strong> {hints[hintIdx]}</>
          : 'Think carefully before you push... every move counts.'}
      </span>
      <span className={styles.meta}>Tries: <em>{restarts}</em></span>
    </div>
  )
}