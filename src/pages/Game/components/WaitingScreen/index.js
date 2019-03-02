import React from 'react'
import styled from 'styled-components'

import Player from './components/Player'

const Container = styled.div`
  position: absolute;
  top: 0;
  background: #444;
  width: 100vw;
  height: 100vh;
  padding: 128px;
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
      <Heading>
        {props.countdownSeconds !== null
          ? `Game starts in ${props.countdownSeconds} seconds`
          : 'Waiting for other players'}
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
    </Container>
  )
}

export default WaitingScreen
