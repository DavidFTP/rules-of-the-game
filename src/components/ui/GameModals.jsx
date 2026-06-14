import React from 'react'
import Modal, { ModalTitle, ModalBody, Btn } from './Modal.jsx'
import { useLanguage } from '../../i18n/LanguageContext.jsx'

export function WinModal({ levelNum, tokens, onHub }) {
  const { t } = useLanguage()
  return (
    <Modal>
      <ModalTitle>{t('win.title', { n: levelNum })}</ModalTitle>
      <ModalBody>
        {t('win.body')}
        {tokens > 0 && (
          <span style={{ display: 'block', color: 'var(--gold)', marginTop: 10 }}>
            {t('win.tokens', { n: tokens })}
          </span>
        )}
      </ModalBody>
      <Btn variant="green" onClick={onHub}>{t('win.backToHub')}</Btn>
    </Modal>
  )
}

export function RoundWinModal({ roundNum, totalRounds, tokens, onNext, onHub }) {
  const { t } = useLanguage()
  return (
    <Modal>
      <ModalTitle>{t('roundWin.title', { n: roundNum, total: totalRounds })}</ModalTitle>
      <ModalBody>
        {t('roundWin.body')}
        {tokens > 0 && (
          <span style={{ display: 'block', color: 'var(--gold)', marginTop: 10 }}>
            {t('roundWin.tokens', { n: tokens })}
          </span>
        )}
      </ModalBody>
      <Btn variant="gold"      onClick={onNext}>{t('roundWin.next')}</Btn>
      <Btn variant="secondary" onClick={onHub}>{t('roundWin.hub')}</Btn>
    </Modal>
  )
}

export function CrackLoseModal({ onRetry, onHub }) {
  const { t } = useLanguage()
  return (
    <Modal>
      <ModalTitle>{t('crackLose.title')}</ModalTitle>
      <ModalBody>
        {t('crackLose.body')}
      </ModalBody>
      <Btn variant="primary"   onClick={onRetry}>{t('crackLose.tryAgain')}</Btn>
      <Btn variant="secondary" onClick={onHub}>{t('roundWin.hub')}</Btn>
    </Modal>
  )
}

export function ComingSoonModal({ levelNum, onHub }) {
  const { t } = useLanguage()
  return (
    <Modal>
      <ModalTitle>{t('comingSoon.title', { n: levelNum })}</ModalTitle>
      <ModalBody>
        {t('comingSoon.body')}
      </ModalBody>
      <Btn variant="secondary" onClick={onHub}>{t('comingSoon.backToHub')}</Btn>
    </Modal>
  )
}
