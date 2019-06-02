import game from '..'

const createImage = (imageName: string, textureName?: string) => {
  const texture = textureName
    ? PIXI.loader.resources[textureName].texture
    : PIXI.loader.resources[imageName].texture

  const image = new PIXI.Sprite(texture)

  image.anchor.set(0.5, 0.5)

  game.stage[imageName].addChild(image)

  return image
}

export default createImage
