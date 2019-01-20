import getPixelPosition from '../utils/getPixelPosition'

class Tile {
  constructor({ two, x, z, radius, camera, owner }) {
    this.originalRadius = radius
    this.radius = radius
    this.two = two
    this.x = x
    this.z = z
    this.camera = camera
    this.owner = owner

    const pixel = getPixelPosition(x, z, camera, radius)
    const pattern = owner ? owner.pattern : '#eee'

    this.image = this.two.makePolygon(0, 0, this.radius, 6)

    this.image.fill = pattern
    this.image.stroke = '#ccc'
    this.image.rotation = Math.PI / 2
    this.image.scale = 1
    this.image.translation.x = pixel.x
    this.image.translation.y = pixel.y
  }
  setRadius(radius) {
    const { x, z, originalRadius, camera } = this

    this.radius = radius

    const scale = radius / originalRadius
    const pixel = getPixelPosition(x, z, camera, radius)

    this.image.scale = scale
    this.image.translation.x = pixel.x
    this.image.translation.y = pixel.y
  }
  updateCamera(camera) {
    const { x, z, radius } = this

    this.camera = camera

    const pixel = getPixelPosition(x, z, camera, radius)

    this.image.translation.x = pixel.x
    this.image.translation.y = pixel.y
  }
}

export default Tile
