import styled, { css } from 'styled-components'
import store from '../../../../store'
import { observer } from 'mobx-react-lite'
import Players from './Players'
import React from 'react'
import Chat from '../../../homepage/Chat'
import Header from '../../../../components/Header'
import Spinner from '../../../../components/Spinner'
import getPlayerGroups from '../../../../utils/getPlayerGroups'
import GameMode from '../../../../types/GameMode'
import { CHAT_WIDTH, BREAKPOINT } from '../../../../constants/react'
import Player from '../../../../game/classes/Player'

const Container = styled.div`
  position: absolute;
  top: 0;
  width: calc(100vw - ${CHAT_WIDTH});
  height: 100vh;
  padding-left: 64px;
  padding-right: 64px;
  z-index: 1;
  padding-top: 80px;
  display: grid;
  grid-template-columns: 2fr 1.5fr 2fr;
  grid-gap: 16px;

  @media (max-width: ${BREAKPOINT.HIDE_CHAT}) {
    width: 100vw;
  }
`

const CentralSection = styled.div<{ ffa: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #222;
  border-left: 1px solid #111;
  border-right: 1px solid #111;
  padding-top: 64px;
  padding-left: 32px;
  padding-right: 32px;

  ${props =>
    props.ffa &&
    css`
      border-bottom: 1px solid #111;
      border-bottom-left-radius: 32px;
      border-bottom-right-radius: 32px;
      height: 400px;
    `}
`

const GameMode = styled.div`
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

  if (store.game.mode !== 'FFA') {
    const { playerId } = store.game
    const groups = getPlayerGroups(Object.values(store.game.players))
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
    const players = Object.values(store.game.players)
    playersLeft = players.slice(0, 3)
    playersRight = players.slice(3, 6)
  }

  return (
    <>
      <Header />
      <Container>
        <Players players={playersLeft} />

        <CentralSection ffa={store.game.mode === 'FFA'}>
          <GameMode>
            <p>{store.game.ranked ? 'RANKED' : 'NORMAL'}</p>
            <h2>{store.game.mode}</h2>
          </GameMode>

          <Countdown>
            {store.game.startCountdown || (
              <Spinner size="68px" thickness="2px" color="#aaa" />
            )}
          </Countdown>

          {store.game.mode !== 'FFA' && <VS>VS</VS>}
        </CentralSection>

        <Players players={playersRight} />
      </Container>
      <Chat />
    </>
  )
}

export default observer(Lobby)
