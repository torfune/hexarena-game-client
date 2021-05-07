import { Sprite } from 'pixi.js'
import hex from './hex'
import store from '../store'
import getTexture from './getTexture'
import { IMAGE_Z_INDEX } from '../../constants/constants-game'
import getImageZIndex from './getImageZIndex'

interface Options {
  tint?: string
  zIndex?: number
  axialZ?: number
}

const createImage = (textureName: string, options: Options = {}) => {
  if (!store.game || !store.game.pixi) return new Sprite()

  const image = new Sprite(getTexture(textureName))

  image.anchor.set(0.5, 0.5)
  image.zIndex = getImageZIndex(textureName, {
    zIndex: options.zIndex,
    axialZ: options.axialZ,
  })

  if (options.tint) {
    image.tint = hex(options.tint)
  }

  store.game.pixi.stage.addChild(image)
  return image
}

export default createImage
