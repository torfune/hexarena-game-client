import * as PIXI from 'pixi.js'

import hex from './hex'

const createImage = (texture, { color, position, scale, stage, alpha = 1 }) => {
  const image = new PIXI.Sprite(PIXI.loader.resources[texture].texture)

  if (color) {
    image.tint = hex(color)
  }

  image.x = position.x
  image.y = position.y
  image.scale.x = scale
  image.scale.y = scale
  image.alpha = alpha
  image.anchor.set(0.5, 0.5)

  stage.addChild(image)

  return image
}

export default createImage
