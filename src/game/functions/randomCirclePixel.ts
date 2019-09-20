import { Pixel } from '../../types/coordinates'

const randomCirclePixel = (radius: number): Pixel => {
  const angle = Math.random() * Math.PI * 2

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  }
}

export default randomCirclePixel
