import React from 'react'
import Modal, { ModalTitle, ModalBody, Btn } from './Modal.jsx'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { ASSET_PATHS } from '../../config/spriteConfig.js'

function ModalCurrencyIcon({ type }) {
  const src = ASSET_PATHS.currency?.[type]
  return src ? <img src={src} alt="" style={{ width: 16, height: 16, verticalAlign: 'middle', marginInlineEnd: 3 }} /> : null
}

export function WinModal({ levelNum, bag, onHub }) {
  const { t } = useLanguage()
  const entries = Object.entries(bag ?? {}).filter(([, v]) => v > 0)
  return (
    <Modal>
      <ModalTitle>{t('win.title', { n: levelNum })}</ModalTitle>
      <ModalBody>
        {t('win.body')}
        {entries.length > 0 && entries.map(([cur, amt]) => (
          <span key={cur} style={{ display: 'block', color: 'var(--gold)', marginTop: 10 }}>
            <ModalCurrencyIcon type={cur} /> {amt}
          </span>
        ))}
      </ModalBody>
      <Btn variant="green" onClick={onHub}>{t('win.backToHub')}</Btn>
    </Modal>
  )
}

export function RoundWinModal({ roundNum, totalRounds, bag, onNext, onHub }) {
  const { t } = useLanguage()
  const entries = Object.entries(bag ?? {}).filter(([, v]) => v > 0)
  return (
    <Modal>
      <ModalTitle>{t('roundWin.title', { n: roundNum, total: totalRounds })}</ModalTitle>
      <ModalBody>
        {t('roundWin.body')}
        {entries.length > 0 && entries.map(([cur, amt]) => (
          <span key={cur} style={{ display: 'block', color: 'var(--gold)', marginTop: 10 }}>
            <ModalCurrencyIcon type={cur} /> {amt}
          </span>
        ))}
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
