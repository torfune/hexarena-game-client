import styled, { css } from 'styled-components'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import Players from './Players'
import React from 'react'
import Spinner from '../../components/Spinner'
import getPlayerGroups from '../../utils/getPlayerGroups'
import Player from '../../game/classes/Player'

const Container = styled.div`
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
  padding-left: 64px;
  padding-right: 64px;
  z-index: 1;
  display: grid;
  grid-template-columns: 2fr 1.5fr 2fr;
  grid-gap: 16px;
`
const CentralSection = styled.div<{ ffa: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #222;
  border-left: 1px solid #111;
  border-right: 1px solid #111;
  padding-top: 128px;
  padding-left: 32px;
  padding-right: 32px;
  grid-column: 2;

  ${props =>
    props.ffa &&
    css`
      border-bottom: 1px solid #111;
      border-bottom-left-radius: 32px;
      border-bottom-right-radius: 32px;
      height: 400px;
    `}
`
const GameModeSection = styled.div`
  color: #fff;
  text-align: center;
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;

  p {
    font-size: 24px;
    font-weight: 500;
    color: #ccc;
  }
  h2 {
    font-size: 64px;
    font-weight: 600;
  }
`
const Countdown = styled.div`
  font-size: 80px;
  color: #ccc;
  margin-top: 32px;
  height: 150px;
  font-weight: 300;
  display: flex;
  align-items: center;
`
const VS = styled.p`
  font-size: 80px;
  margin-top: 24px;
  color: #fff;
  font-weight: 600;
  border-top: 1px solid #ccc;
  padding-top: 8px;
`

const Lobby = () => {
  if (!store.game || !store.game.mode) return null

  let playersLeft: Player[] = []
  let playersRight: Player[] = []

  if (store.game.mode !== 'FFA_6') {
    const { playerId } = store.game
    const groups = getPlayerGroups(Array.from(store.game.players.values()))
    const groupLeft = groups.find(
      group => !!group.players.find(p => p.id === playerId)
    )
    const groupRight = groups.find(
      group => !group.players.find(p => p.id === playerId)
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

  return (
    <Container>
      <Players players={playersLeft} />

      <CentralSection ffa={store.game.mode === 'FFA_6'}>
        <GameModeSection>
          <h2>{store.game.mode}</h2>
        </GameModeSection>

        <Countdown>
          {store.game.startCountdown || (
            <Spinner size="68px" thickness="2px" color="#aaa" />
          )}
        </Countdown>

        {store.game.mode !== 'FFA_6' && <VS>VS</VS>}
      </CentralSection>

      <Players players={playersRight} />
    </Container>
  )
}

export default observer(Lobby)
