import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import store from '../core/store'
import React, { useEffect } from 'react'
import getWebClientUrl from '../utils/getWebClientUrl'
import isSpectating from '../utils/isSpectating'
import cancelSpectate from '../utils/cancelSpectate'
import Modal from './Modal'
import Button from './Button'
import getPlacementMessage from '../utils/getPlacementMessage'
import getGameServerUrl from '../utils/getGameServerUrl'
import SoundManager from '../services/SoundManager'

const EndModal = () => {
  const { game } = store

  useEffect(() => {
    if (isSpectating() || !game) return

    if (game.mode === 'FFA-6') {
      if (game.player!.place! <= 3) {
        SoundManager.play('VICTORY')
      } else {
        SoundManager.play('DEFEAT')
      }
    } else if (game.mode === 'FFA-3') {
      if (game.player!.place! <= 2) {
        SoundManager.play('VICTORY')
      } else {
        SoundManager.play('DEFEAT')
      }
    } else if (game.mode.includes('1v1')) {
      if (game.player?.alive && !game.player.surrendered) {
        SoundManager.play('VICTORY')
      } else {
        SoundManager.play('DEFEAT')
      }
    }
  }, [])

  if (
    !game ||
    game.time === null ||
    (game.mode.includes('FFA') && !game.player?.place && !isSpectating())
  ) {
    return null
  }

  let result: string
  let reason = ''

  if (isSpectating()) {
    result = 'THE END'
  } else {
    if (!game.player) return null

    // FFA
    if (game.mode.includes('FFA')) {
      if (game.player.surrendered) {
        result = getPlacementMessage(game.player.place!)
        reason = 'You have surrendered.'
      } else if (game.time === 0 && game.player.alive) {
        result = getPlacementMessage(game.player.place!)
        reason = `Time's up.`
      } else if (!game.player.alive) {
        result = getPlacementMessage(game.player.place!)
        reason = 'You have lost your capital.'
      } else {
        result = getPlacementMessage(game.player.place!)
        reason = 'All enemies have been eliminated.'
      }
    }

    // 2v2
    else if (game.mode === '2v2') {
      if (game.player.surrendered) {
        result = 'DEFEAT'
        reason = 'You have surrendered.'
      } else if (
        game.time === 0 &&
        game.player.alive &&
        game.player.place === 1
      ) {
        result = 'VICTORY'
        reason = `Time's up. Your team has more tiles.`
      } else if (
        game.time === 0 &&
        game.player.alive &&
        game.player.place === 2
      ) {
        result = 'DEFEAT'
        reason = `Time's up. Enemy team has more tiles.`
      } else if (!game.player.alive) {
        result = 'DEFEAT'
        reason = 'You have lost your capital.'
      } else {
        result = 'VICTORY'
        reason = 'All enemies have been eliminated.'
      }
    }

    // 1v1
    else {
      if (game.player.surrendered) {
        result = 'DEFEAT'
        reason = 'You have surrendered.'
      } else if (
        game.time === 0 &&
        game.player.alive &&
        game.player.place === 1
      ) {
        result = 'VICTORY'
        reason = `Time's up. You have more tiles than your opponent.`
      } else if (
        game.time === 0 &&
        game.player.alive &&
        game.player.place === 2
      ) {
        result = 'DEFEAT'
        reason = `Time's up. Your opponent has more tiles.`
      } else if (!game.player.alive) {
        result = 'DEFEAT'
        reason = 'You have lost your capital.'
      } else {
        result = 'VICTORY'
        reason = 'All enemies have been eliminated.'
      }
    }

    // AFK message
    if (game.player.afkKicked) {
      reason = 'You were AFK for too long.'
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
          <StyledButton
            onClick={() => {
              window.location.href = getWebClientUrl()
            }}
            marginTop={48}
          >
            Continue
          </StyledButton>

          {showSpectateButton && (
            <StyledButton
              onClick={() => {
                const url = `${getWebClientUrl()}/spectate?gameId=${
                  game.id
                }&gameServerHost=${getGameServerUrl()?.split('//')[1]}`
                window.location.href = url
              }}
              marginTop={16}
              background="GREEN"
              backgroundHover="GREEN_HOVER"
            >
              Spectate
            </StyledButton>
          )}
        </>
      )}
    </Modal>
  )
}

const ResultText = styled.p`
  color: #fff;
  font-weight: 600;
  font-size: 40px;
  letter-spacing: 2px;
`
const ReasonText = styled.p`
  color: #fff;
  opacity: 0.4;
  margin-top: 8px;
  font-size: 16px;
`
const StyledButton = styled(Button)<{ marginTop?: number }>`
  margin-left: auto;
  margin-right: auto;
  margin-top: ${(props) => props.marginTop}px;
`

export default observer(EndModal)
