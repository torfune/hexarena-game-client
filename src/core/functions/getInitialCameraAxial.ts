import { Axial } from '../../types/coordinates'

const START_POSITIONS: { [key: string]: Axial } = {
  // 1v1
  '-4|8': { x: -3, z: 6 },
  '4|-8': { x: 3, z: -6 },

  // FFA
  '10|-10': { x: 8, z: -8 }, // 0
  '10|0': { x: 8, z: 0 }, // 1
  '0|10': { x: 0, z: 8 }, // 2
  '-10|10': { x: -8, z: 8 }, // 3
  '-10|0': { x: -8, z: 0 }, // 4
  '0|-10': { x: 0, z: -8 }, // 5
}

export function getInitialCameraAxial(axial: Axial) {
  const axialString = `${axial.x}|${axial.z}`
  return START_POSITIONS[axialString] || axial
}
