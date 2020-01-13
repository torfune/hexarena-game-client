import React from 'react'
import store from '../../store'
import Player from '../../game/classes/Player'
import styled from 'styled-components'

const renderEndStatement = (players: Player[]) => {
  if (!store.game || store.game.time === null) return null

  if (store.game.time <= 0) {
    return <Statement>DRAW</Statement>
  }

  const winner = players.find((player: Player) => player.alive)

  if (winner === store.game.player) {
    return <Statement>VICTORY</Statement>
  } else {
    return <Statement>DEFEAT</Statement>
  }
}

const Statement = styled.p`
  color: #fff;
  text-align: center;
  font-weight: 600;
  font-size: 30px;
  letter-spacing: 2px;
  line-height: 30px;
`

export default renderEndStatement
