const getRotationBySide = (side: number) => {
  switch (side) {
    case 0:
      return 0
    case 1:
      return Math.PI * (1 / 3)
    case 2:
      return Math.PI * (2 / 3)
    case 3:
      return Math.PI
    case 4:
      return Math.PI * (-2 / 3)
    case 5:
      return Math.PI * (-1 / 3)
  }

  return 0
}

export const getArrowRotationBySide = (side: number) => {
  switch (side) {
    case 0:
      return Math.PI * (-1 / 3)
    case 1:
      return 0
    case 2:
      return Math.PI * (1 / 3)
    case 3:
      return Math.PI * (2 / 3)
    case 4:
      return Math.PI
    case 5:
      return Math.PI * (-2 / 3)
  }

  return 0
}

export default getRotationBySide
