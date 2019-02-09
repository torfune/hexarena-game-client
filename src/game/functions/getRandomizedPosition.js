import chance from './chance'

const getRandomizedPosition = (position, offset) => {
  let offsetX = Math.round(Math.random() * offset)
  let offsetY = Math.round(Math.random() * offset)

  if (chance(50)) {
    offsetX *= -1
  }

  if (chance(50)) {
    offsetY *= -1
  }

  return {
    x: position.x + offsetX,
    y: position.y + offsetY,
  }
}

export default getRandomizedPosition
