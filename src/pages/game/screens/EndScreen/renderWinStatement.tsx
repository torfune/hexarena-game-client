import Player from '../../../../game/classes/Player'
import React from 'react'
import store from '../../../../store'

const renderWinStatement = (players: Player[]) => {
  if (store.game && store.game.mode === 'FFA') {
    const players = Array.from(store.game.players.values())
    const winners = players.filter(p => p.alive)

    return (
      <>
        Winners:{' '}
        {winners.map((w, i) => (
          <span key={w.id}>
            {i > 0 ? ', ' : ''}
            {w.name}
          </span>
        ))}
      </>
    )
  }

  if (players.length === 1 || !players[1].alive) {
    return (
      <>
        Player <span>{players[0].name}</span> is the only winner.
      </>
    )
  }

  return (
    <>
      Players <span>{players[0].name}</span> and <span>{players[1].name}</span>{' '}
      are the winners.
    </>
  )
}

export default renderWinStatement
