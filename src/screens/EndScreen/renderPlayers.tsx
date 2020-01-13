import React from 'react'
import styled from 'styled-components'
import Player from '../../game/classes/Player'

const renderPlayers = (players: Player[]) => (
  <Container>
    <PlayerContainer justify="right" winner={players[0].alive}>
      <Name>{players[0].name}</Name>
      <Pattern color={players[0].pattern} />
    </PlayerContainer>

    <Line />

    <PlayerContainer
      justify="left"
      winner={players[1] ? players[1].alive : false}
    >
      {players[1] && (
        <>
          <Pattern color={players[1].pattern} />
          <Name>{players[1].name}</Name>
        </>
      )}
    </PlayerContainer>
  </Container>
)

const Container = styled.div`
  display: flex;
  font-size: 18px;
`
const PlayerContainer = styled.div<{
  winner: boolean
  justify: 'left' | 'right'
}>`
  display: flex;
  white-space: nowrap;
  border-radius: 42px;
  width: 200px;
  background: ${props => (props.winner ? '#444' : '#222')};
  justify-content: ${props => props.justify};
  padding: 8px 4px;
`
const Pattern = styled.div<{ color: string }>`
  height: 24px;
  width: 24px;
  border-radius: 100%;
  background: ${props => props.color};
  align-self: center;
  margin: 0 8px;
`
const Name = styled.p`
  align-self: center;
  font-weight: 500;
`
const Line = styled.div`
  align-self: center;
  margin: 0 16px;
  height: 100%;
  border-left: 2px solid #888;
`

export default renderPlayers
