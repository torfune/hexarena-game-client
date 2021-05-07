import Animation from '../classes/Animation'
import { Sprite } from 'pixi.js'
import store from '../store'

const getImageAnimation = (image: Sprite) => {
  if (!store.game) return null

  for (let i = 0; i < store.game.animations.length; i++) {
    const animation = store.game.animations[i]

    if (animation instanceof Animation && animation.image === image) {
      return animation
    }
  }

  return null
}

export default getImageAnimation
