import styled, { css } from 'styled-components'
import store from '../../core/store'
import { observer } from 'mobx-react-lite'
import Players from './Players'
import React from 'react'
import Spinner from '../Spinner'
import getPlayerGroups from '../../utils/getPlayerGroups'
import Player from '../../core/classes/Player'
import { COLOR, SHADOW, Z_INDEX } from '../../constants/constants-react'
import formatMode from '../../utils/formatMode'

const Lobby = () => {
  if (!store.game || !store.game.mode || store.game.players.size === 0) {
    return null
  }

  let playersLeft: Player[] = []
  let playersRight: Player[] = []

  if (!store.game.mode.includes('FFA')) {
    const { playerId } = store.game
    const groups = getPlayerGroups(Array.from(store.game.players.values()))
    const groupLeft = groups.find(
      (group) => !!group.players.find((p) => p.id === playerId)
    )
    const groupRight = groups.find(
      (group) => !group.players.find((p) => p.id === playerId)
    )

    if (groupLeft) {
      playersLeft = groupLeft.players
    }

    if (groupRight) {
      playersRight = groupRight.players
    }
  } else {
    const players = Array.from(store.game.players.values())
    playersLeft = players.slice(0, 3)
    playersRight = players.slice(3, 6)
  }

  const ffa = store.game.mode.includes('FFA')

  return (
    <Container ffa={ffa}>
      {!ffa && <Players players={playersLeft} />}

      <InfoSection ffa={ffa}>
        <GameModeText>{formatMode(store.game.mode)}</GameModeText>

        <Countdown>
          {store.game.startCountdown || (
            <Spinner size="68px" thickness="2px" color="#aaa" />
          )}
        </Countdown>
      </InfoSection>

      {!ffa ? (
        <Players players={playersRight} />
      ) : (
        <Players players={playersLeft.concat(playersRight)} ffa />
      )}
    </Container>
  )
}

const Container = styled.div<{ ffa: boolean }>`
  position: absolute;
  top: 0;
  height: 100vh;
  padding-left: 64px;
  padding-right: 64px;
  z-index: ${Z_INDEX.LOBBY};
  display: grid;
  grid-template-columns: 2fr 1.5fr 2fr;
  grid-gap: 16px;
  width: 100vw;
  background: ${COLOR.GREY_200};

  ${(props) =>
    props.ffa &&
    css`
      display: block;
    `}
`
const InfoSection = styled.div<{ ffa: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${COLOR.GREY_600};
  padding-top: 128px;
  padding-left: 32px;
  padding-right: 32px;
  box-shadow: ${SHADOW.MEDIUM};

  ${(props) =>
    props.ffa &&
    css`
      width: 380px;
      padding-top: 32px;
      height: auto;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
      margin-bottom: 64px;
      margin-left: auto;
      margin-right: auto;
    `}
`
const GameModeText = styled.div`
  color: ${COLOR.GREY_100};
  text-align: center;
  border-bottom: 1px solid ${COLOR.GREY_100};
  padding-bottom: 8px;
  font-size: 32px;
  font-weight: 600;
`
const Countdown = styled.div`
  font-size: 64px;
  color: ${COLOR.GREY_100};
  margin-top: 16px;
  height: 150px;
  font-weight: 300;
  display: flex;
  align-items: center;
`

export default observer(Lobby)
