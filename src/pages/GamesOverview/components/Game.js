import React from 'react'
import styled from 'styled-components'

import Player from './Player'
import { BOX_SHADOW } from '../../../constants'

const statusColor = status => {
  switch (status) {
    case 'pending':
      return '#0097e6' // blue

    case 'starting':
      return '#44bd32' // green

    case 'running':
      return '#c23616' // red

    default:
      return '#000'
  }
}

const Container = styled.div`
  background: #fff;
  margin-bottom: 16px;
  border-radius: 4px;
  display: flex;
  overflow: hidden;
  box-shadow: ${BOX_SHADOW};
`

const Status = styled.div`
  font-weight: 600;
  padding: 16px 0;
  width: 128px;
  text-align: center;
  color: #fff;
  background: ${({ status }) => statusColor(status)};
`

const PlayersList = styled.div`
  display: flex;
  align-items: center;
`

const Game = ({ status, players }) => (
  <Container>
    <Status status={status}>{status}</Status>
    <PlayersList>
      {players.map(({ id, name, pattern }) => (
        <Player key={id} name={name} pattern={pattern} />
      ))}
    </PlayersList>
  </Container>
)

export default Game
