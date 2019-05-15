const roundToDecimals = (number: number, decimalPlaces: number) => {
  const power = Math.pow(10, decimalPlaces)
  const rounded = Math.round(number * power) / power

  return rounded
}

export default roundToDecimals
