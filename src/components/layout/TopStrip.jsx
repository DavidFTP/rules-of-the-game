import React from 'react'
import styles from './TopStrip.module.css'

export default function TopStrip({ config, state, levelNum, restarts, roundIndex, totalRounds }) {
  const roundInfo = totalRounds > 1
    ? <span className={styles.roundBadge}>Round {(roundIndex ?? 0) + 1}/{totalRounds}</span>
    : null

  if (!config) return <DefaultStrip levelNum={levelNum} state={state} roundInfo={roundInfo} />

  switch (config.topStripMode) {
    case 'marquee':  return <MarqueeStrip   config={config} state={state} levelNum={levelNum} roundInfo={roundInfo} />
    case 'narrative':return <NarrativeStrip config={config} state={state} levelNum={levelNum} roundInfo={roundInfo} />
    case 'council':  return <CouncilStrip   config={config} roundInfo={roundInfo} />
    case 'simon':    return <SimonStrip     config={config} state={state}  levelNum={levelNum} roundInfo={roundInfo} />
    case 'hints':    return <HintsStrip     config={config} restarts={restarts} roundInfo={roundInfo} />
    default:         return <DefaultStrip   levelNum={levelNum} state={state} roundInfo={roundInfo} />
  }
}

function DefaultStrip({ levelNum, state, roundInfo }) {
  return (
    <div className={styles.strip}>
      <span className={styles.title}>{levelNum ? `LVL ${levelNum}` : 'THE WAY'}</span>
      {roundInfo}
      <span className={styles.text}>Use arrow keys to move. Push boxes onto the targets.</span>
      <span className={styles.meta}>Moves: <em>{state?.moves ?? 0}</em></span>
    </div>
  )
}

function NarrativeStrip({ config, state, levelNum, roundInfo }) {
  return (
    <div className={styles.strip}>
      <span className={styles.title}>LVL {levelNum}</span>
      {roundInfo}
      <span className={styles.text}>{config.narrativeText}</span>
      <span className={styles.meta}>Moves: <em>{state?.moves ?? 0}</em></span>
    </div>
  )
}

function MarqueeStrip({ config, state, levelNum, roundInfo }) {
  const segments = config.tutorialSegments ?? []
  return (
    <div className={styles.strip}>
      <span className={styles.title}>LVL {levelNum}</span>
      {roundInfo}
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

function CouncilStrip({ config, roundInfo }) {
  return (
    <div className={`${styles.strip} ${styles.councilWrap}`}>
      {roundInfo && <span className={styles.title} style={{flexShrink:0}}>{roundInfo}</span>}
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

function SimonStrip({ config, state, levelNum }) {
  // 🚨 THE FIX: Look at state.config first so we get the current round's sequence!
  const activeConfig = state?.config || config;
  const seq  = activeConfig.simonSequence ?? [];
  const done = state?.simonStep ?? 0;
  
  const arrowMap = { ArrowUp: '⬆️ UP', ArrowDown: '⬇️ DOWN', ArrowLeft: '⬅️ LEFT', ArrowRight: '➡️ RIGHT' };
  const currentCommand = seq[done];

  return (
    <div className={styles.strip} style={{ justifyContent: 'center', position: 'relative' }}>
      <span className={styles.title} style={{ position: 'absolute', left: '18px' }}>LVL {levelNum}</span>
      
      <div style={{ 
        fontSize: '15px', 
        fontWeight: 'bold', 
        letterSpacing: '1px', 
        color: '#FFD700',
        fontFamily: 'monospace'
      }}>
        {currentCommand 
            ? `NEXT: ${arrowMap[currentCommand] || currentCommand}` 
            : "✅ ALL INSTRUCTIONS FOLLOWED"}
      </div>
    </div>
  )
}

function HintsStrip({ config, restarts, roundInfo }) {
  const threshold = config.hintThreshold ?? 3
  const hints     = config.hints ?? []
  const hintIdx   = Math.min(restarts - threshold, hints.length - 1)
  const showHint  = restarts >= threshold && hintIdx >= 0
  return (
    <div className={styles.strip}>
      <span className={styles.title}>LVL 8</span>
      {roundInfo}
      <span className={styles.text}>
        {showHint
          ? <><strong>💡 Hint:</strong> {hints[hintIdx]}</>
          : 'Think carefully before you push... every move counts.'}
      </span>
      <span className={styles.meta}>Tries: <em>{restarts}</em></span>
    </div>
  )
}