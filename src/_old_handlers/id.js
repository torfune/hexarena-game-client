import game from '../../..'

const handleId = id => {
  if (game.playerId) return

  game.playerId = id
  game.startedAt = Date.now()
}

export default handleId
