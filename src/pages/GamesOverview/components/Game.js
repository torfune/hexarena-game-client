import React from 'react'
import styled from 'styled-components'

import Player from './Player'
import { BOX_SHADOW } from '../../../constants'

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
  background: ${({ status }) => (status === 'running' ? '#44bd32' : '#0097e6')};
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
