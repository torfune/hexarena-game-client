import game from 'game'

const getImageAnimation = image => {
  for (let i = 0; i < game.animations.length; i++) {
    if (game.animations[i].image === image) {
      return game.animations[i]
    }
  }

  return null
}

export default getImageAnimation
