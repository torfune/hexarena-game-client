import * as PIXI from 'pixi.js'
import game from '../../game'

const createImage = (imageName, textureName) => {
  const texture = textureName
    ? PIXI.loader.resources[textureName].texture
    : PIXI.loader.resources[imageName].texture

  const image = new PIXI.Sprite(texture)

  image.anchor.set(0.5, 0.5)
  game.stage[imageName].addChild(image)

  return image
}

export default createImage
