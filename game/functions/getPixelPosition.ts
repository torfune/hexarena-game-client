import { TILE_RADIUS } from '../../constants/game'
import game from '..'
import { Axial, Pixel } from '../../types/coordinates'

const getPixelPosition = ({ x, z }: Axial): Pixel => ({
  x: TILE_RADIUS * game.scale * 2 * (Math.sqrt(3) * x + (Math.sqrt(3) / 2) * z),
  y: TILE_RADIUS * game.scale * 2 * ((3 / 2) * z),
})

export default getPixelPosition
