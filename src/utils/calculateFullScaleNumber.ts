const calculateFullScaleNumber = (number: number, scale: number) => {
  const percents = scale * 100
  const onePercent = number / percents

  return number + (100 - percents) * onePercent
}

export default calculateFullScaleNumber
