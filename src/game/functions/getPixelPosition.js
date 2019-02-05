import game from '../../game'
import { TILE_RADIUS } from '../../constants'

const getPixelPosition = (x, z) => ({
  x: TILE_RADIUS * game.scale * 2 * (Math.sqrt(3) * x + (Math.sqrt(3) / 2) * z),
  y: TILE_RADIUS * game.scale * 2 * ((3 / 2) * z),
})

export default getPixelPosition
