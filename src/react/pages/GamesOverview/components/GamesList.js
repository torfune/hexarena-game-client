import React from 'react'
import styled from 'styled-components'

import Game from './Game'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: #444;
  padding: 128px;
`

const Heading = styled.h2`
  color: #fff;
  margin-bottom: 32px;
  font-size: 32px;
`

const GamesList = ({ games }) => (
  <Container>
    <Heading>Games overview</Heading>
    {games.map(({ id, status, players }) => (
      <Game key={id} status={status} players={players} />
    ))}
  </Container>
)

export default GamesList
