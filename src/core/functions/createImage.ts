import { Sprite } from 'pixi.js-legacy'
import hex from './hex'
import store from '../store'
import getTexture from './getTexture'

const createImage = (stageName: string, textureName?: string) => {
  if (!store.game) return new Sprite()

  // const texture = textureName
  //   ? loader.resources[textureName].texture
  //   : loader.resources[stageName].texture

  // new PIXI.Sprite()

  const image = new Sprite(getTexture(textureName || stageName))

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
