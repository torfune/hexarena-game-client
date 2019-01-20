const createHexagon = ({ two, fill, stroke, pixel, radius, opacity = 1 }) => {
  const hexagon = two.makePolygon(0, 0, radius, 6)

  hexagon.fill = fill
  hexagon.stroke = stroke
  hexagon.rotation = Math.PI / 2
  hexagon.translation.x = pixel.x
  hexagon.translation.y = pixel.y
  hexagon.opacity = opacity

  return hexagon
}

export default createHexagon
