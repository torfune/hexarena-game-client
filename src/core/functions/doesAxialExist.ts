import { Axial } from '../../types/coordinates'

function doesAxialExist(axial: Axial, worldSize: number): boolean {
  for (let x = -worldSize; x <= worldSize; x++) {
    const z1 = Math.max(-worldSize, -x - worldSize)
    const z2 = Math.min(worldSize, -x + worldSize)
    for (let z = z1; z <= z2; z++) {
      if (axial.x === x && axial.z === z) {
        return true
      }
    }
  }

  return false
}

export default doesAxialExist
