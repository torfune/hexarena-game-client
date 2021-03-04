import { Loader } from 'pixi.js-legacy'

const loader = Loader.shared

function getTexture(textureName: string) {
  const sheet = loader.resources['spritesheet'].spritesheet
  if (!sheet) throw Error('Sheet not found')

  try {
    return sheet.textures[textureName + '.png']
  } catch {
    throw Error(`Texture not found: ${textureName}`)
  }
}

export default getTexture
