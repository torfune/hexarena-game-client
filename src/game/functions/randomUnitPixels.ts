import { Pixel } from '../../types/coordinates'
import Circle from '../../types/Circle'
import { UNIT_SIZE, UNIT_OFFSET } from '../../constants/game'
import randomPixel from './randomPixel'
import randomCirclePixel from './randomCirclePixel'

const maxIterations = 100
export type Area =
  | 'FILL'
  | 'STRUCTURE'
  | 'EDGE_CAMP'
  | 'EDGE_TOWER'
  | 'EDGE_CASTLE'
  | 'EDGE_CAPITAL'
  | 'EDGE_MOUNTAIN'

const randomUnitPixels = (count: number, basePixel: Pixel, area: Area) => {
  const pixels: Pixel[] = []
  for (let i = 0; i < count; i++) {
    let pixel = null
    let iterations = 0

    if (area === 'STRUCTURE') {
      const offset = randomCirclePixel(UNIT_OFFSET.STRUCTURE.RADIUS)
      pixel = {
        x: basePixel.x + offset.x,
        y: basePixel.y + UNIT_OFFSET.STRUCTURE.Y_OFFSET + offset.y,
      }
      pixels.push(pixel)
      continue
    }

    do {
      iterations++

      if (area === 'FILL') {
        pixel = randomPixel(
          basePixel,
          UNIT_OFFSET.FILL + count * UNIT_OFFSET.FILL
        )
      } else {
        let edgeOffset: number
        switch (area.split('EDGE_')[1]) {
          case 'CAMP':
            edgeOffset = UNIT_OFFSET.EDGE.CAMP
            break
          case 'TOWER':
            edgeOffset = UNIT_OFFSET.EDGE.TOWER
            break
          case 'CASTLE':
            edgeOffset = UNIT_OFFSET.EDGE.CASTLE
            break
          case 'CAPITAL':
            edgeOffset = UNIT_OFFSET.EDGE.CAPITAL
            break
          default:
            edgeOffset = UNIT_OFFSET.EDGE.MOUNTAIN
            break
        }

        const offset = randomCirclePixel(edgeOffset)
        pixel = {
          x: basePixel.x + offset.x,
          y: basePixel.y + offset.y,
        }
      }

      if (iterations >= maxIterations) {
        console.warn('Cannot find unique pixel')
        break
      }
    } while (!isUnique(pixel, pixels))

    pixels.push(pixel)
  }

  return pixels
}

const isUnique = (position: Pixel, existingPositions: Pixel[]) => {
  const circle1 = {
    x: position.x,
    y: position.y,
    r: UNIT_SIZE,
  }

  for (let i = 0; i < existingPositions.length; i++) {
    const circle2 = {
      x: existingPositions[i].x,
      y: existingPositions[i].y,
      r: UNIT_SIZE,
    }

    if (circleCircleCollision(circle1, circle2)) {
      return false
    }
  }

  return true
}

const circleCircleCollision = (circle1: Circle, circle2: Circle) => {
  const p1x = circle1.x
  const p1y = circle1.y
  const r1 = circle1.r
  const p2x = circle2.x
  const p2y = circle2.y
  const r2 = circle2.r

  const a = r1 + r2
  const x = p1x - p2x
  const y = p1y - p2y

  if (a > Math.sqrt(x * x + y * y)) {
    return true
  } else {
    return false
  }
}

export default randomUnitPixels
