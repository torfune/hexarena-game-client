import { TILE_RADIUS } from '../constants'

const getPixelPosition = (x, z, camera, scale = 1) => ({
  x:
    camera.x +
    TILE_RADIUS * scale * 2 * (Math.sqrt(3) * x + (Math.sqrt(3) / 2) * z),
  y: camera.y + TILE_RADIUS * scale * 2 * ((3 / 2) * z),
})

export default getPixelPosition
