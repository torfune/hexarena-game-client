import game from '..'
import Animation from '../classes/Animation'
import { Sprite } from 'pixi.js'

const getImageAnimation = (image: Sprite) => {
  for (let i = 0; i < game.animations.length; i++) {
    const animation = game.animations[i]

    if (animation instanceof Animation && animation.image === image) {
      return animation
    }
  }

  return null
}

export default getImageAnimation
