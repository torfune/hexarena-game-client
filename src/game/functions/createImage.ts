import { Sprite, Loader } from 'pixi.js'
import hex from './hex'
import store from '../../store'

const loader = Loader.shared

const createImage = (stageName: string, textureName?: string) => {
  if (!store.game) return new Sprite()

  const texture = textureName
    ? loader.resources[textureName].texture
    : loader.resources[stageName].texture

  const image = new Sprite(texture)
  image.anchor.set(0.5, 0.5)

  // Special properties
  if (stageName === 'background') {
    image.tint = hex('#eee')
  }

  const stage = store.game.stage.get(stageName)
  if (!stage) return new Sprite()

  stage.addChild(image)
  return image
}

export default createImage
