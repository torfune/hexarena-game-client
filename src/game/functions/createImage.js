import * as PIXI from 'pixi.js'

import game from '../../game'

const createImage = imageName => {
  const image =
    imageName === 'background'
      ? new PIXI.Sprite(PIXI.loader.resources['pattern'].texture)
      : new PIXI.Sprite(PIXI.loader.resources[imageName].texture)

  image.anchor.set(0.5, 0.5)
  game.stage[imageName].addChild(image)

  return image
}

export default createImage
