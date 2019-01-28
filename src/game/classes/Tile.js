import Animation from './Animation'
import getPixelPosition from '../functions/getPixelPosition'
import createImage from '../functions/createImage'
import hex from '../functions/hex'

class Tile {
  constructor({ x, z, stage, camera, owner, animations, scale }) {
    this.animations = animations
    this.x = x
    this.z = z
    this.camera = camera
    this.owner = owner
    this.stage = stage
    this.scale = scale
    this.image = {}

    const position = getPixelPosition(x, z, scale)

    this.image.background = createImage('hexagon', {
      color: '#eee',
      position,
      scale,
      stage,
    })

    if (owner) {
      this.image.pattern = createImage('hexagon', {
        color: owner.pattern,
        position,
        scale,
        stage,
      })
    }
  }
  setScale(scale) {
    const { x, z } = this

    this.scale = scale

    const position = getPixelPosition(x, z, scale)

    if (this.image.background) {
      this.image.background.scale.x = scale
      this.image.background.scale.y = scale
      this.image.background.x = position.x
      this.image.background.y = position.y
    }

    if (this.image.pattern) {
      this.image.pattern.scale.x = scale
      this.image.pattern.scale.y = scale
      this.image.pattern.x = position.x
      this.image.pattern.y = position.y
    }

    if (this.image.testSprite) {
      this.image.testSprite.scale.x = scale
      this.image.testSprite.scale.y = scale
      this.image.testSprite.x = position.x
      this.image.testSprite.y = position.y
    }
  }
  setOwner(owner) {
    const { x, z, scale, stage } = this

    this.owner = owner

    if (owner && !this.image.pattern) {
      this.image.pattern = createImage('hexagon', {
        color: owner.pattern,
        position: getPixelPosition(x, z, scale),
        scale,
        stage,
        alpha: 0,
      })

      this.animations.push(
        new Animation({
          image: this.image.pattern,
          onUpdate: image => {
            const newAlpha = image.alpha + 0.1
            if (newAlpha >= 1) return true
            image.alpha = newAlpha
          },
        })
      )
    }
  }
  addHighlight() {
    this.image.background.tint = hex('#ddd')
  }
  clearHighlight() {
    this.image.background.tint = hex('#eee')
  }
  showTestSprite(texture) {
    const position = getPixelPosition(this.x, this.z, this.scale)

    this.image.testSprite = createImage(texture, {
      position,
      scale: this.scale,
      stage: this.stage,
    })
  }
}

export default Tile
