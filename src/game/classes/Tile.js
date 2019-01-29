import Animation from './Animation'
import getPixelPosition from '../functions/getPixelPosition'
import createImage from '../functions/createImage'
import hex from '../functions/hex'

class Tile {
  constructor({ x, z, stages, camera, owner, animations, scale, mountain }) {
    this.animations = animations
    this.x = x
    this.z = z
    this.camera = camera
    this.owner = owner
    this.stages = stages
    this.scale = scale
    this.image = {}
    this.mountain = mountain

    const position = getPixelPosition(x, z, scale)

    this.image.background = createImage('hexagon', {
      color: '#eee',
      position,
      scale,
      stage: stages.backgrounds,
    })

    if (mountain) {
      this.image.mountain = createImage('mountain', {
        position,
        scale,
        stage: stages.mountains,
      })
    }

    if (owner) {
      this.image.pattern = createImage('hexagon', {
        color: owner.pattern,
        position,
        scale,
        stage: stages.patterns,
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

    if (this.image.mountain) {
      this.image.mountain.scale.x = scale
      this.image.mountain.scale.y = scale
      this.image.mountain.x = position.x
      this.image.mountain.y = position.y
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
    const { x, z, scale, stages } = this

    this.owner = owner

    if (owner) {
      if (this.image.pattern) {
        this.stages.patterns.removeChild(this.image.pattern)
      }

      this.image.pattern = createImage('hexagon', {
        color: owner.pattern,
        position: getPixelPosition(x, z, scale),
        scale,
        stage: stages.patterns,
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
      stage: this.stages.mountains,
    })
  }
}

export default Tile
