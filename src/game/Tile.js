const startX = 100
const startY = 100

class Tile {
  constructor(two, x, z, radius) {
    this.originalRadius = radius
    this.radius = radius
    this.two = two
    this.x = x
    this.z = z

    const scale = this.originalRadius / this.radius
    const size = this.radius * 2
    const pixel = {
      x: size * (Math.sqrt(3) * x + (Math.sqrt(3) / 2) * z) + startX,
      y: size * ((3 / 2) * z) + startY,
    }

    this.image = this.two.makePolygon(0, 0, this.radius, 6)

    this.image.fill = '#eee'
    this.image.stroke = '#ccc'
    this.image.rotation = Math.PI / 2
    this.image.scale = scale
    this.image.translation.x = pixel.x
    this.image.translation.y = pixel.y
  }
  setRadius(radius) {
    const { x, z, originalRadius } = this

    this.radius = radius

    const scale = this.radius / originalRadius
    const size = this.radius * 2
    const pixel = {
      x: size * (Math.sqrt(3) * x + (Math.sqrt(3) / 2) * z) + startX,
      y: size * ((3 / 2) * z) + startY,
    }

    this.image.scale = scale
    this.image.translation.x = pixel.x
    this.image.translation.y = pixel.y

    this.image.scale = scale
  }
}

export default Tile
