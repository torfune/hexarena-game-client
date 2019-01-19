const renderTiles = (two, tiles, radius) => {
  const size = radius * 2

  const startX = 100
  const startY = 100

  for (let i = 0; i < tiles.length; i++) {
    const { x, z } = tiles[i]

    const pixel = {
      x: size * (Math.sqrt(3) * x + (Math.sqrt(3) / 2) * z) + startX,
      y: size * ((3 / 2) * z) + startY,
    }

    const hexagon = two.makePolygon(pixel.x, pixel.y, radius, 6)

    hexagon.fill = '#eee'
    hexagon.stroke = '#ccc'
    hexagon.rotation = Math.PI / 2
  }

  two.update()
}

export default renderTiles
