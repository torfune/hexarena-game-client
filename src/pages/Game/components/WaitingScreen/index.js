import React from 'react'
import styled from 'styled-components'

import Player from './components/Player'
import Chat from './components/Chat'

const Container = styled.div`
  position: absolute;
  top: 0;
  background: #444;
  width: 100vw;
  height: 100vh;
  padding: 128px;
  display: grid;
  grid-template-columns: 2fr 1fr;
`

const Heading = styled.h2`
  color: #fff;
  font-size: 32px;
  text-align: center;
`

const Row = styled.div`
  margin-top: 64px;
  display: flex;
  justify-content: center;
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

const WaitingScreen = props => {
  const players = []

  for (let i = 0; i < playersPerRoom; i++) {
    players.push(
      props.players[i] || {
        id: null,
        name: null,
        pattern: null,
      }
    )
  }

  return (
    <Container>
      <div>
        <Heading>
          {props.countdownSeconds !== null
            ? `Game starts in ${props.countdownSeconds} seconds`
            : getWaitingMessage(props.players.length, props.minPlayers)}
        </Heading>
        <Row>
          {players.slice(0, 3).map(({ name, pattern }, index) => (
            <Player key={index} name={name} pattern={pattern} />
          ))}
        </Row>
        <Row>
          {players.slice(3, 6).map(({ name, pattern }, index) => (
            <Player key={index} name={name} pattern={pattern} />
          ))}
        </Row>
      </div>
      <Chat messages={props.messages} sendMessage={props.sendMessage} />
    </Container>
  )
}

export default WaitingScreen
