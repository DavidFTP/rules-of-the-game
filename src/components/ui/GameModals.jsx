import React from 'react'
import Modal, { ModalTitle, ModalBody, Btn } from './Modal.jsx'

/** Shown when the entire level is complete */
export function WinModal({ levelNum, tokens, onHub }) {
  return (
    <Modal>
      <ModalTitle>🎉 Level {levelNum} Complete!</ModalTitle>
      <ModalBody>
        Well done — you made it through every round!
        {tokens > 0 && (
          <span style={{ display: 'block', color: 'var(--gold)', marginTop: 10 }}>
            Total tokens earned: 🪙 {tokens}
          </span>
        )}
      </ModalBody>
      <Btn variant="green" onClick={onHub}>Back to Hub</Btn>
    </Modal>
  )
}

/** Shown between rounds — "Round X done, next round coming" */
export function RoundWinModal({ roundNum, totalRounds, tokens, onNext, onHub }) {
  return (
    <Modal>
      <ModalTitle>✅ Round {roundNum} of {totalRounds} Done!</ModalTitle>
      <ModalBody>
        Great push! Keep going — the next round is waiting.
        {tokens > 0 && (
          <span style={{ display: 'block', color: 'var(--gold)', marginTop: 10 }}>
            Tokens so far: 🪙 {tokens}
          </span>
        )}
      </ModalBody>
      <Btn variant="gold"      onClick={onNext}>Next Round →</Btn>
      <Btn variant="secondary" onClick={onHub}>Hub</Btn>
    </Modal>
  )
}

/** Gold box fell on a crack tile */
export function CrackLoseModal({ onRetry, onHub }) {
  return (
    <Modal>
      <ModalTitle>💥 The Floor Gave Way!</ModalTitle>
      <ModalBody>
        Heavy boxes are risky. The cracked floor couldn't hold the weight.
        Sometimes the humble path is the safe one.
      </ModalBody>
      <Btn variant="primary"   onClick={onRetry}>Try Again</Btn>
      <Btn variant="secondary" onClick={onHub}>Hub</Btn>
    </Modal>
  )
}

/** Levels not yet built */
export function ComingSoonModal({ levelNum, onHub }) {
  return (
    <Modal>
      <ModalTitle>🔒 Level {levelNum}</ModalTitle>
      <ModalBody>
        This level is coming soon! The engine and config are all ready —
        the puzzle maps just need to be designed and wired in.
      </ModalBody>
      <Btn variant="secondary" onClick={onHub}>Back to Hub</Btn>
    </Modal>
  )
}