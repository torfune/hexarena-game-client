import { Loader } from 'pixi.js-legacy'

const loader = Loader.shared

function getTexture(textureName: string) {
  const sheet = loader.resources['spritesheet'].spritesheet
  if (!sheet) throw Error('Sheet not found')

  const texture = sheet.textures[textureName + '.png']
  if (!texture) {
    throw Error(`Texture not found: ${textureName}`)
  } else {
    return texture
  }
}

export default getTexture
