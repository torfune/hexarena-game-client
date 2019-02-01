import { TILE_RADIUS } from '../../constants'

const pixelToAxial = (pixel, scale) => {
  const size = TILE_RADIUS * scale * 2

  const x = ((Math.sqrt(3) / 3) * pixel.x - (1 / 3) * pixel.y) / size
  const z = ((2 / 3) * pixel.y) / size

  return axialRound({ x, z })
}

const cubeRound = cube => {
  let rx = Math.round(cube.x)
  let ry = Math.round(cube.y)
  let rz = Math.round(cube.z)

  const xDiff = Math.abs(rx - cube.x)
  const yDiff = Math.abs(ry - cube.y)
  const zDiff = Math.abs(rz - cube.z)

  if (xDiff > yDiff && xDiff > zDiff) {
    rx = -ry - rz
  } else if (yDiff > zDiff) {
    ry = -rx - rz
  } else {
    rz = -rx - ry
  }

  return { x: rx, y: ry, z: rz }
}

const axialRound = axial => {
  return cubeToAxial(cubeRound(axialToCube(axial)))
}

const cubeToAxial = cube => {
  return { x: cube.x, z: cube.z }
}

const axialToCube = axial => {
  return { x: axial.x, y: -axial.x - axial.z, z: axial.z }
}

export default pixelToAxial
