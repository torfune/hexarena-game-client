import { Sprite } from 'pixi.js'
import hex from './hex'
import store from '../store'
import getTexture from './getTexture'

interface Options {
  tint?: string
  group?:
    | 'background'
    | 'patterns'
    | 'borders'
    | 'actions'
    | 'objects'
    | 'fogs'
    | 'dragArrows'
    | 'overlay'
}

const createImage = (textureName: string, options: Options = {}) => {
  if (!store.game || !store.game.pixi) return new Sprite()

  const image = new Sprite(getTexture(textureName))
  image.anchor.set(0.5, 1)

  if (options.group) {
    let group
    switch (options.group) {
      case 'background':
        group = store.game.backgroundGroup
        break
      case 'patterns':
        group = store.game.patternsGroup
        break
      case 'borders':
        group = store.game.bordersGroup
        break
      case 'actions':
        group = store.game.actionsGroup
        break
      case 'objects':
        group = store.game.objectsGroup
        break
      case 'fogs':
        group = store.game.fogsGroup
        break
      case 'dragArrows':
        group = store.game.dragArrowsGroup
        break
      case 'overlay':
        group = store.game.overlayGroup
        break
      default:
        throw Error(`Unsupported group: ${options.group}`)
    }
    ;(image as any).parentGroup = group
  } else {
    console.log(`Image ${textureName} has no group!`)
  }

  if (options.tint) {
    image.tint = hex(options.tint)
  }

  store.game.pixi.stage.addChild(image)
  return image
}

export default createImage
