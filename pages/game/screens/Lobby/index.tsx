import { useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import Player from './PlayerAvatar'
import Winners from '../../../homepage/Winners'
import Chat from './Chat'
import store from '../../../../store'
import { observer } from 'mobx-react-lite'
import game from '../../../../game'
import { FadeDown, FadeUp } from '../../../../components/Animations'
import getGameserverHost from '../../../../utils/getGameserverHost'
import PlayerAvatar from './PlayerAvatar'

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
  padding: 16px 64px;
  box-shadow: 0 4px 8px #00000022;
`

const Logo = styled.h2`
  font-size: 40px;
  color: #fff;
`

const MainSection = styled.div`
  padding: 32px 64px;
  display: grid;
  grid-template-columns: 340px 2fr 1fr;
  grid-gap: 48px;
  margin-top: 32px;
`

const Players = styled.div`
  width: 852px;
  margin: 0 auto;
`

const WinnersContainer = styled.div`
  overflow-y: scroll;
  height: 600px;
  padding-right: 32px;
`

interface HeadingProps {
  marginBottom?: string
  center?: boolean
}
const Heading = styled.h2<HeadingProps>`
  color: #fff;
  font-size: 32px;
  font-weight: 600;
  margin-bottom: ${props => props.marginBottom};
  text-align: ${props => (props.center ? 'center' : 'left')};
`

const Row = styled.div`
  margin-top: 64px;
  display: flex;
`

const playersPerRoom = 6

const getWaitingMessage = (numberOfPlayers: number, minPlayers: number) => {
  const n = minPlayers - numberOfPlayers

  if (n <= 0 || numberOfPlayers === 0) {
    return '. . .'
  }

  if (n === 1) {
    return 'Waiting for 1 more player'
  } else {
    return `Waiting for ${n} more players`
  }
}

const Lobby = () => {
  const players = []

  // useEffect(() => {
  //   fetchWinners()
  // }, [])

  // const fetchWinners = async () => {
  //   const GAMESERVER_HOST = getGameserverHost(window.location.hostname)
  //   const response = await axios.get(`http://${GAMESERVER_HOST}/winners`)
  //   const winners = response.data
  //     .split('\n')
  //     .filter(l => l !== '')
  //     .reverse()

  //   store.winners = winners
  // }

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

  if (!store.gsConfig) return null

  return (
    <Container>
      <Header>
        <a href="/">
          <Logo>HexArena.io</Logo>
        </a>
      </Header>

      <MainSection>
        <div>
          <Heading>Winners</Heading>

          <WinnersContainer>
            <Winners />
          </WinnersContainer>
        </div>

        <Players>
          <FadeDown>
            <Heading marginBottom="-16px" center>
              {store.startCountdown !== null
                ? `Game starts in ${store.startCountdown} seconds`
                : getWaitingMessage(
                    store.players.length,
                    store.gsConfig.MIN_PLAYERS
                  )}
            </Heading>
            <Row>
              {players.slice(0, 3).map(({ id, name, pattern }, index) => (
                <PlayerAvatar
                  key={index}
                  name={name}
                  pattern={pattern}
                  isThisPlayer={id === store.playerId}
                  players={store.players}
                  onPatternSelect={game.selectPattern}
                />
              ))}
            </Row>
            <Row>
              {players.slice(3, 6).map(({ id, name, pattern }, index) => (
                <PlayerAvatar
                  key={index}
                  name={name}
                  pattern={pattern}
                  isThisPlayer={id === store.playerId}
                  players={store.players}
                  onPatternSelect={game.selectPattern}
                />
              ))}
            </Row>
          </FadeDown>
        </Players>

        <FadeUp>
          <Heading>Chat</Heading>
          <Chat />
        </FadeUp>
      </MainSection>
    </Container>
  )
}

export default observer(Lobby)
