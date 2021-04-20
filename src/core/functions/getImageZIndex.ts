import { IMAGE_Z_INDEX } from '../../constants/constants-game'

const MAX_Y = 3800

interface Options {
  zIndex?: number
  axialZ?: number
}

function getImageZIndex(textureName: string, options: Options = {}) {
  let zIndex = IMAGE_Z_INDEX.indexOf(textureName)

  if (options.zIndex !== undefined) {
    zIndex = options.zIndex
  }

  if (options.axialZ !== undefined) {
    zIndex += MAX_Y + options.axialZ * 256
  }

  return zIndex
}

export default getImageZIndex
