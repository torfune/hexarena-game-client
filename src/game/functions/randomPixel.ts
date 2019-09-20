import chance from './chance'
import { Pixel } from '../../types/coordinates'

const randomPixel = (pixel: Pixel, offset: number) => {
  let offsetX = Math.round(Math.random() * offset)
  let offsetY = Math.round(Math.random() * offset)

  if (chance(50)) {
    offsetX *= -1
  }

  if (chance(50)) {
    offsetY *= -1
  }

  return {
    x: pixel.x + offsetX,
    y: pixel.y + offsetY,
  }
}

export default randomPixel
