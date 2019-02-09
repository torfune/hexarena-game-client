import getRandomizedPosition from './getRandomizedPosition'

const maxIterations = 1000

const getUniqueRandomizedPositions = (count, radius, basePosition, offset) => {
  const positions = []

  for (let i = 0; i < count; i++) {
    let position = null
    let iterations = 0

    do {
      position = getRandomizedPosition(basePosition, offset)
      iterations++

      if (iterations >= maxIterations) {
        console.warn('Cannot find unique position.')
        break
      }
    } while (!isUnique(position, positions, radius))

    positions.push(position)
  }

  return positions
}

const isUnique = (position, existingPositions, radius) => {
  const circle1 = {
    x: position.x,
    y: position.y,
    r: radius,
  }

  for (let i = 0; i < existingPositions.length; i++) {
    const circle2 = {
      x: existingPositions[i].x,
      y: existingPositions[i].y,
      r: radius,
    }

    if (circleCircleCollision(circle1, circle2)) {
      return false
    }
  }

  return true
}

const circleCircleCollision = (circle1, circle2) => {
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

export default getUniqueRandomizedPositions
