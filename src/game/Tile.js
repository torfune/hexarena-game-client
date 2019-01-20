import getPixelPosition from '../utils/getPixelPosition'
import createHexagon from '../utils/createHexagon'
import Animation from './Animation'

class Tile {
  constructor({ two, x, z, radius, camera, owner, animations }) {
    this.originalRadius = radius
    this.radius = radius
    this.two = two
    this.animations = animations
    this.x = x
    this.z = z
    this.camera = camera
    this.owner = owner
    this.image = {}

    const pixel = getPixelPosition(x, z, camera, radius)

    this.image.background = createHexagon({
      two,
      fill: '#eee',
      stroke: '#ccc',
      pixel,
      radius,
    })

    if (owner) {
      this.image.pattern = createHexagon({
        two,
        fill: owner.pattern,
        stroke: '#fff',
        pixel,
        radius,
      })
    }
  }
  setRadius(radius) {
    const { x, z, originalRadius, camera } = this

    this.radius = radius

    const scale = radius / originalRadius
    const pixel = getPixelPosition(x, z, camera, radius)

    if (this.image.background) {
      this.image.background.scale = scale
      this.image.background.translation.set(pixel.x, pixel.y)
    }

    if (this.image.pattern) {
      this.image.pattern.scale = scale
      this.image.pattern.translation.set(pixel.x, pixel.y)
    }
  }
  updateCamera(camera) {
    const { x, z, radius } = this

    this.camera = camera

    const pixel = getPixelPosition(x, z, camera, radius)

    if (this.image.background) {
      this.image.background.translation.set(pixel.x, pixel.y)
    }

    if (this.image.pattern) {
      this.image.pattern.translation.set(pixel.x, pixel.y)
    }
  }
  setOwner(owner) {
    const { x, z, camera, radius, two } = this

    this.owner = owner

    if (owner && !this.image.pattern) {
      const pixel = getPixelPosition(x, z, camera, radius)

      this.image.pattern = createHexagon({
        two,
        fill: owner.pattern,
        stroke: '#fff',
        pixel,
        radius,
        opacity: 0,
      })

      this.animations.push(
        new Animation({
          image: this.image.pattern,
          onUpdate: image => {
            const newOpacity = image.opacity + 0.08
            if (newOpacity >= 1) return true
            image.opacity = newOpacity
          },
        })
      )
    }
  }
}

export default Tile
