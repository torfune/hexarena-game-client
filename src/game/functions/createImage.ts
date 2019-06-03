import game from '..'
import { loader, Sprite } from 'pixi.js'

const createImage = (imageName: string, textureName?: string) => {
  const texture = textureName
    ? loader.resources[textureName].texture
    : loader.resources[imageName].texture

  const image = new Sprite(texture)

  image.anchor.set(0.5, 0.5)

  game.stage[imageName].addChild(image)

  return image
}

export default createImage
