import React from 'react'
import Modal, { ModalTitle, ModalBody, Btn } from './Modal.jsx'

export function WinModal({ levelNum, tokens, onHub }) {
  return (
    <Modal>
      <ModalTitle>🎉 Level {levelNum} Complete!</ModalTitle>
      <ModalBody>
        Well done! You solved it.
        {tokens > 0 && (
          <span style={{ display: 'block', color: 'var(--gold)', marginTop: 10 }}>
            Tokens earned: 🪙 {tokens}
          </span>
        )}
      </ModalBody>
      <Btn variant="green" onClick={onHub}>Back to Hub</Btn>
    </Modal>
  )
}

export function CrackLoseModal({ onRetry, onHub }) {
  return (
    <Modal>
      <ModalTitle>💥 The Floor Gave Way!</ModalTitle>
      <ModalBody>
        Heavy boxes are risky. The cracked floor couldn't hold the weight.
        Sometimes the humble path is the safe one.
      </ModalBody>
      <Btn variant="primary" onClick={onRetry}>Try Again</Btn>
      <Btn variant="secondary" onClick={onHub}>Hub</Btn>
    </Modal>
  )
}

export function ComingSoonModal({ levelNum, onHub }) {
  return (
    <Modal>
      <ModalTitle>🔒 Level {levelNum}</ModalTitle>
      <ModalBody>
        This level is coming soon! The engine and config are ready — the full
        puzzle and artwork just need to be wired in.
      </ModalBody>
      <Btn variant="secondary" onClick={onHub}>Back to Hub</Btn>
    </Modal>
  )
}