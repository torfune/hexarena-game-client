import styled from 'styled-components'
import TopPlayers from '../../../homepage/TopPlayers'
import Chat from './Chat'
import store from '../../../../store'
import game from '../../../../game'
import { observer } from 'mobx-react-lite'
import { FadeDown, FadeUp } from '../../../../components/Animations'
import PlayerAvatar from './PlayerAvatar'
import LoginBar from './LoginBar'

const Container = styled.div`
  position: absolute;
  top: 0;
  background: #333;
  width: 100vw;
  height: 100vh;
  z-index: 1;
`

const Header = styled.div`
  display: flex;
  background: #282828;
  padding: 16px 64px;
  box-shadow: 0 4px 8px #00000022;
  justify-content: space-between;
  align-items: center;
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

const TopPlayersContainer = styled.div`
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

        <LoginBar />
      </Header>

      <MainSection>
        <div>
          <Heading>Top 20 players</Heading>

          <TopPlayersContainer>
            <TopPlayers fixedHeight />
          </TopPlayersContainer>
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
