const shadeColor = (color: string, percent: number) => {
  const R1 = parseInt(color.substring(1, 3), 16)
  const G1 = parseInt(color.substring(3, 5), 16)
  const B1 = parseInt(color.substring(5, 7), 16)

  const R2 = parseInt(String((R1 * (100 + percent)) / 100))
  const G2 = parseInt(String((G1 * (100 + percent)) / 100))
  const B2 = parseInt(String((B1 * (100 + percent)) / 100))

  const R3 = R2 < 255 ? R2 : 255
  const G3 = G2 < 255 ? G2 : 255
  const B3 = B2 < 255 ? B2 : 255

  const RR =
    R3.toString(16).length == 1 ? '0' + R3.toString(16) : R3.toString(16)
  const GG =
    G3.toString(16).length == 1 ? '0' + G3.toString(16) : G3.toString(16)
  const BB =
    B3.toString(16).length == 1 ? '0' + B3.toString(16) : B3.toString(16)

  return '#' + RR + GG + BB
}

export default shadeColor
