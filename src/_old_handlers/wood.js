import game from '../../..'

const handleWood = wood => {
  game.wood = Number(wood)
  game.react.setWood(game.wood)
}

export default handleWood
