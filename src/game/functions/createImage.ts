import { Sprite, Loader } from 'pixi.js'
import hex from './hex'
import store from '../../store'

const loader = Loader.shared

const createImage = (imageName: string, textureName?: string) => {
  if (!store.game) return new Sprite()

  const texture = textureName
    ? loader.resources[textureName].texture
    : loader.resources[imageName].texture

  const image = new Sprite(texture)

  image.anchor.set(0.5, 0.5)

  // Special properties
  if (imageName === 'background') {
    image.tint = hex('#eee')
  }

  if (!store.game.stage[imageName]) return new Sprite()

  store.game.stage[imageName].addChild(image)
  return image
}

export default createImage
