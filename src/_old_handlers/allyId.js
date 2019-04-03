import game from '../../..'

const handleAllyId = allyId => {
  const ally = game.players.find(p => p.id === allyId)

  game.react.setAlly(ally)
}

export default handleAllyId
