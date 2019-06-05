import styled from 'styled-components'
import TopPlayers from '../../../homepage/TopPlayers'
import Chat from './Chat'
import store from '../../../../store'
import { observer } from 'mobx-react-lite'
import LoginBar from './LoginBar'
import Players from './Players'
import React from 'react'

const HEADER_HEIGHT = 80

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
  background: #222;
  padding: 16px 64px;
  height: ${HEADER_HEIGHT}px;
  box-shadow: 0 4px 8px #00000022;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled.h2`
  font-size: 40px;
  color: #fff;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 450px auto 30%;
  position: relative;
`

const WaitingMessage = styled.span`
  font-size: 24px;
  color: #eee;
  font-weight: 200;
`

const ScrollableContainer = styled.div`
  padding-right: 24px;
  position: relative;
  height: calc(100vh - ${HEADER_HEIGHT}px - 96px - 58px);
  width: 100%;
  overflow: auto;
`

interface HeadingProps {
  marginBottom?: string
  center?: boolean
}
const Heading = styled.h2<HeadingProps>`
  color: #fff;
  font-size: 28px;
  font-weight: 500;
  padding-bottom: 24px;
  display: block;
  text-align: ${props => (props.center ? 'center' : 'left')};
`

const Column = styled.div`
  padding: 32px 0;
  height: calc(100vh - ${HEADER_HEIGHT}px);
  padding-left: 64px;
  padding-right: 64px;

  @media (max-width: 1600px) {
    padding-left: 48px;
    padding-right: 48px;
  }

  :first-child {
    border-right: 1px solid #242424;
    padding-left: 64px;
    padding-right: 32px;
    background: #2b2b2b;
  }

  :last-child {
    border-left: 1px solid #2c2c2c;
  }
`

const getWaitingMessage = (numberOfPlayers: number, minPlayers: number) => {
  const n = minPlayers - numberOfPlayers

  if (n <= 0 || numberOfPlayers === 0) {
    return '. . .'
  }

  if (n === 1) {
    return 'waiting for 1 more player'
  } else {
    return `waiting for ${n} more players`
  }
}

const Lobby = () => {
  if (!store.gsConfig || !store.player) return null

  const waitingMessage = getWaitingMessage(
    store.players.length,
    store.gsConfig.MIN_PLAYERS
  )

  return (
    <Container>
      <Header>
        <a href="/">
          <Logo>HexArena.io</Logo>
        </a>

        <LoginBar />
      </Header>

      <Grid>
        <Column>
          <Heading>Top 20 players</Heading>
          <ScrollableContainer>
            <TopPlayers />
          </ScrollableContainer>
        </Column>

        <Column>
          <Heading>Lobby </Heading>
          <WaitingMessage>
            {store.startCountdown !== null
              ? `Game starts in ${store.startCountdown} seconds`
              : waitingMessage}
          </WaitingMessage>
          <Players />
        </Column>

        <Column>
          <Heading>Chat</Heading>
          <Chat />
        </Column>
      </Grid>
    </Container>
  )
}

export default observer(Lobby)
