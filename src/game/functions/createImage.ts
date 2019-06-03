import game from '..'
import { Sprite, Loader } from 'pixi.js'
import hex from './hex'

const loader = Loader.shared

const createImage = (imageName: string, textureName?: string) => {
  const texture = textureName
    ? loader.resources[textureName].texture
    : loader.resources[imageName].texture

  const image = new Sprite(texture)

  image.anchor.set(0.5, 0.5)

  // Special properties
  if (imageName === 'background') {
    image.tint = hex('#eee')
  }

  game.stage[imageName].addChild(image)

  return image
}

export default createImage
