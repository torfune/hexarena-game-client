import { Axial } from '../types/coordinates'
import { NEIGHBOR_DIRECTIONS } from '../constants/constants-game'

const axialInDirection = (
  axial: Axial,
  direction: number,
  distance = 1
): Axial => ({
  x: axial.x + NEIGHBOR_DIRECTIONS[direction].x * distance,
  z: axial.z + NEIGHBOR_DIRECTIONS[direction].z * distance,
})

export default axialInDirection
