import getTileByXZ from './getTileByXZ'
import pixelToAxial from './pixelToAxial'

const getTileByPixelPosition = (tiles, pixel, scale) => {
  const axial = pixelToAxial(pixel, scale)

  return getTileByXZ(axial.x, axial.z)
}

export default getTileByPixelPosition
