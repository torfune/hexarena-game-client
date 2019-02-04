import * as PIXI from 'pixi.js'

const createImage = (texture, stage) => {
  const image = new PIXI.Sprite(PIXI.loader.resources[texture].texture)

  image.anchor.set(0.5, 0.5)
  stage.addChild(image)

  return image
}

export default createImage
