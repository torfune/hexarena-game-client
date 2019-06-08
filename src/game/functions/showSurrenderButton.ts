import Player from '../classes/Player'

const showSurrenderButton = (players: Player[], player: Player | null) => {
  let alivePlayers = 0

  for (let i = 0; i < players.length; i++) {
    if (players[i].alive) {
      alivePlayers++
    }
  }

  if (
    player &&
    player.alive &&
    alivePlayers === 3 &&
    (!player.ally || !player.ally.alive)
  ) {
    for (let i = 0; i < players.length; i++) {
      const p = players[i]
      if (p.id !== player.id && p.ally && p.ally.alive) {
        return true
      }
    }
  }
}

export default showSurrenderButton
