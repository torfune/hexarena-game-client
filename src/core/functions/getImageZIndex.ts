import { IMAGE_Z_INDEX } from '../../constants/constants-game'

interface Options {
  zIndex?: number
  axialZ?: number
}

function getImageZIndex(textureName: string, options: Options = {}) {
  let zIndex = IMAGE_Z_INDEX.indexOf(textureName)

  if (options.zIndex) {
    zIndex = options.zIndex
  }

  if (options.axialZ) {
    zIndex += 5000 + 256 * options.axialZ
  }

  return zIndex
}

export default getImageZIndex
