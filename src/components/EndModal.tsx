import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import store from '../core/store'
import React from 'react'
import getWebClientUrl from '../utils/getWebClientUrl'
import isSpectating from '../utils/isSpectating'
import cancelSpectate from '../utils/cancelSpectate'
import Modal from './Modal'
import Button from './Button'

const EndModal = () => {
  const { game } = store
  if (!game || game.time === null) return null

  let result: string
  let reason = ''

  if (isSpectating()) {
    result = 'THE END'
  } else {
    if (!game.player) return null

    if (game.player.surrendered) {
      result = 'DEFEAT'
      reason = 'You have surrendered.'
    } else if (game.time === 0 && game.player.alive) {
      if (game.mode.includes('FFA')) {
        result = 'VICTORY'
        reason = 'You have survived.'
      } else {
        result = 'DRAW'
        reason = `Time's up.`
      }
    } else if (!game.player.alive) {
      result = 'DEFEAT'
      reason = 'You have lost your capital.'
    } else {
      result = 'VICTORY'
      reason = 'All enemies have been eliminated.'
    }
  }

  let alivePlayersCount = 0
  if (game) {
    for (const player of Array.from(game.players.values())) {
      if (player.alive) {
        alivePlayersCount++
      }
    }
  }
  const showSpectateButton = game.status === 'running' && alivePlayersCount >= 2

  return (
    <Modal width={500}>
      <ResultText>{result}</ResultText>
      {reason && <ReasonText>{reason}</ReasonText>}

      {isSpectating() ? (
        <StyledButton onClick={cancelSpectate} marginTop={48}>
          Continue
        </StyledButton>
      ) : (
        <>
          <StyledAnchor href={getWebClientUrl()}>
            <StyledButton marginTop={48}>Continue</StyledButton>
          </StyledAnchor>

          {showSpectateButton && (
            <StyledAnchor
              href={`${getWebClientUrl()}/spectate?gameId=${game.id}`}
            >
              <StyledButton
                marginTop={16}
                background="GREEN"
                backgroundHover="GREEN_HOVER"
              >
                Spectate
              </StyledButton>
            </StyledAnchor>
          )}
        </>
      )}
    </Modal>
  )
}

const ResultText = styled.p`
  color: #fff;
  font-weight: 600;
  font-size: 36px;
  letter-spacing: 8px;
`
const ReasonText = styled.p`
  color: #fff;
  opacity: 0.4;
  margin-top: 8px;
  font-size: 16px;
`
const StyledAnchor = styled.a`
  display: inline-block;
`
const StyledButton = styled(Button)<{ marginTop?: number }>`
  margin-top: ${(props) => props.marginTop}px;
  margin-left: auto;
  margin-right: auto;
`

export default observer(EndModal)
