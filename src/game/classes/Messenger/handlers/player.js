import game from '../../..'
import Player from '../../Player'
import Parser from '../../Parser'
import getItemById from '../../../functions/getItemById'

const handlePlayer = gsData => {
  const gsPlayers = Parser.parsePlayer(gsData)

  for (let i = 0; i < gsPlayers.length; i++) {
    const gsPlayer = gsPlayers[i]
    let player = getItemById(game.players, gsPlayer.id)

    if (player) {
      player.tilesCount = gsPlayer.tilesCount
      player.pattern = gsPlayer.pattern
      player.allyId = gsPlayer.allyId
      player.allyDied = gsPlayer.allyDied
    } else {
      player = new Player({ ...gsPlayer })
      game.players.push(player)
    }

    if (player.id === game.playerId) {
      game.player = player
      game.react.setPlayer(player)
    }
  }

  for (let i = game.players.length - 1; i >= 0; i--) {
    if (!getItemById(gsPlayers, game.players[i].id)) {
      if (game.status === 'running') {
        game.deadPlayers.push(game.players[i])
      }
      game.players.splice(i, 1)
    }
  }
  game.react.setDeadPlayers(game.deadPlayers)
  game.react.setPlayers(game.players)
}

export default handlePlayer
