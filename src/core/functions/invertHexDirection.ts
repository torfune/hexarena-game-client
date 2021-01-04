const invertHexDirection = (direction: number) => {
  if (direction < 3) {
    return direction + 3
  } else {
    return direction - 3
  }
}

export default invertHexDirection
