import Player from '../../../../game/classes/Player'

const renderWinStatement = (players: Player[]) => {
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
