import React from 'react'
import styled from 'styled-components'
import Player from './Player'
import Chat from './Chat'
import store from '../../../../store'
import { observer } from 'mobx-react-lite'
import Stats from '../../../homepage/MainSection/Stats'
import game from '../../../../game'
import { FadeDown, FadeUp } from '../../../../components/Animations'

const Container = styled.div`
  position: absolute;
  top: 0;
  background: #444;
  width: 100vw;
  height: 100vh;
  z-index: 1;
`

const Header = styled.div`
  display: flex;
  background: #333;
  padding: 16px 128px;
  box-shadow: 0 4px 8px #00000022;
`

const Logo = styled.h2`
  font-size: 40px;
  color: #fff;
`

const MainSection = styled.div`
  padding: 32px 128px;
  display: grid;
  grid-template-columns: 2fr 450px;
  margin-top: 32px;
`

const Heading = styled.h2`
  color: #fff;
  font-size: 30px;
  font-weight: 500;
  margin-bottom: ${props => props.marginBottom};
`

const Row = styled.div`
  margin-top: 64px;
  display: flex;
`

const playersPerRoom = 6

const getWaitingMessage = (numberOfPlayers, minPlayers) => {
  const n = minPlayers - numberOfPlayers

  if (n <= 0 || numberOfPlayers === 0) {
    return '...'
  }

  if (n === 1) {
    return 'Waiting for 1 more player'
  } else {
    return `Waiting for ${n} more players`
  }
}

const Lobby = () => {
  const players = []

  for (let i = 0; i < playersPerRoom; i++) {
    if (i < store.players.length) {
      players.push(store.players[i])
    } else {
      players.push({
        id: null,
        name: null,
        pattern: null,
      })
    }
  }

  return (
    <Container>
      <Header>
        <a href="/">
          <Logo>HexArena.io</Logo>
        </a>
      </Header>

      <MainSection>
        <FadeDown>
          <Heading marginBottom="-16px">
            {store.countdown !== null
              ? `Game starts in ${store.countdown} seconds`
              : getWaitingMessage(
                  store.players.length,
                  store.config.MIN_PLAYERS
                )}
          </Heading>
          <Row>
            {players.slice(0, 3).map(({ id, name, pattern }, index) => (
              <Player
                key={index}
                name={name}
                pattern={pattern}
                isThisPlayer={id === store.player.id}
                players={store.players}
                onPatternSelect={game.selectPattern}
              />
            ))}
          </Row>
          <Row>
            {players.slice(3, 6).map(({ id, name, pattern }, index) => (
              <Player
                key={index}
                name={name}
                pattern={pattern}
                isThisPlayer={id === store.player.id}
                players={store.players}
                onPatternSelect={game.selectPattern}
              />
            ))}
          </Row>
        </FadeDown>

        <FadeUp>
          <Stats />
          <Chat />
        </FadeUp>
      </MainSection>
    </Container>
  )
}

export default observer(Lobby)
