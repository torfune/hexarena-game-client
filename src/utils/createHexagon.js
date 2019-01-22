import { TILE_RADIUS } from '../constants'

const createHexagon = ({ two, fill, pixel, scale, opacity = 1 }) => {
  const hexagon = two.makePolygon(0, 0, TILE_RADIUS, 6)

  hexagon.fill = fill
  hexagon.stroke = '#fff'
  hexagon.rotation = Math.PI / 2
  hexagon.translation.x = pixel.x
  hexagon.translation.y = pixel.y
  hexagon.opacity = opacity
  hexagon.scale = scale

  return hexagon
}

export default createHexagon
