function getPlacementMessage(place: number) {
  switch (place) {
    case 1:
      return `1st place`
    case 2:
      return `2nd place`
    case 3:
      return `3rd place`
    case 4:
      return `4th place`
    case 5:
      return `5th place`
    case 6:
      return `6th place`
    default:
      throw Error(`Unsupported FFA place: ${place}`)
  }
}

export default getPlacementMessage
