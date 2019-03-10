import game from '../../..'
import Player from '../../Player'
import Parser from '../../Parser'
import getItemById from '../../../functions/getItemById'

const handlePlayer = gsData => {
  const gsPlayers = Parser.parsePlayer(gsData)

  for (let i = 0; i < gsPlayers.length; i++) {
    const gsPlayer = gsPlayers[i]
    const player = getItemById(game.players, gsPlayer.id)

    if (player) {
      player.tilesCount = gsPlayer.tilesCount
    } else {
      game.players.push(new Player({ ...gsPlayer }))
    }

    if (gsPlayer.id === game.playerId) {
      game.react.setName(gsPlayer.name)
    }
  }

  for (let i = game.players.length - 1; i >= 0; i--) {
    if (!getItemById(gsPlayers, game.players[i].id)) {
      game.players.splice(i, 1)
    }
  }

  game.react.setPlayers(game.players)
}

export default handlePlayer
