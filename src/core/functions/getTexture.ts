import store from '../store'
import { Loader } from 'pixi.js'

function getTexture(textureName: string) {
  if (!store.game) throw Error('Game does not exist.')

  const sheet = Loader.shared.resources['spritesheet'].spritesheet
  if (!sheet) throw Error('Sheet not found')

  const texture = sheet.textures[textureName + '.png']
  if (!texture) {
    throw Error(`Texture not found: ${textureName}`)
  } else {
    return texture
  }
}

export default getTexture
