const hex = hexColor => {
  if (
    !hexColor.includes('#') ||
    (hexColor.length !== 4 && hexColor.length !== 7)
  ) {
    console.warn(`Invalid color: ${hexColor}`)
    return 0x000000
  }

  if (hexColor.length === 4) {
    hexColor += hexColor.slice(1, 4)
  }

  return Number(hexColor.replace('#', '0x'))
}

export default hex
