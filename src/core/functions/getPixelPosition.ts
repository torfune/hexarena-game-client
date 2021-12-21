import { TILE_RADIUS } from '../../constants/constants-game'
import { Axial, Pixel } from '../../types/coordinates'

const getPixelPosition = ({ x, z }: Axial): Pixel => {
  return {
    x: TILE_RADIUS * 2 * (Math.sqrt(3) * x + (Math.sqrt(3) / 2) * z),
    y: TILE_RADIUS * 2 * ((3 / 2) * z) + TILE_RADIUS * 2,
  }
}

export default getPixelPosition
