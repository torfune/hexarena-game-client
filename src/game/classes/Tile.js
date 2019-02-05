import Animation from './Animation'
import getPixelPosition from '../functions/getPixelPosition'
import createImage from '../functions/createImage'
import hex from '../functions/hex'
import getRotationBySide from '../functions/getRotationBySide'
import { NEIGHBOR_DIRECTIONS, TILE_IMAGES } from '../../constants'

class Tile {
  constructor({
    x,
    z,
    stages,
    camera,
    owner,
    animations,
    scale,
    castle,
    mountain,
    forest,
    water,
    capital,
  }) {
    this.animations = animations
    this.x = x
    this.z = z
    this.camera = camera
    this.owner = owner
    this.stages = stages
    this.scale = scale
    this.image = {}
    this.water = water
    this.castle = castle
    this.mountain = mountain
    this.forest = forest
    this.capital = capital
    this.neighbors = [null, null, null, null, null, null]

    const position = getPixelPosition(x, z, scale)

    this.image.background = createImage('hexagon', stages.backgrounds)
    this.image.background.tint = hex('#eee')

    this.image.fog = []
    for (let i = 0; i < 6; i++) {
      this.image.fog[i] = createImage('fog', stages.fogs)
      this.image.fog[i].rotation = getRotationBySide(i)
      this.image.fog[i].visible = false
    }

    this.image.border = []
    for (let i = 0; i < 6; i++) {
      this.image.border[i] = createImage('border', stages.borders)
      this.image.border[i].rotation = getRotationBySide(i)
      this.image.border[i].visible = false
    }

    if (capital) {
      this.image.capital = createImage('capital', stages.capitals)
    }

    if (castle) {
      this.image.castle = createImage('castle', stages.castles)
    }

    if (water) {
      this.image.water = createImage('water', stages.waters)
    }

    if (mountain) {
      this.image.mountain = createImage('mountain', stages.mountains)
    }

    if (forest) {
      this.image.forest = createImage('forest', stages.forests)
    }

    if (owner) {
      this.image.pattern = createImage('hexagon', stages.patterns)
      this.image.pattern.tint = hex(owner.pattern)
    }

    for (let i = 0; i < TILE_IMAGES.length; i++) {
      const image = this.image[TILE_IMAGES[i]]

      if (!image) continue

      if (image instanceof Array) {
        for (let j = 0; j < 6; j++) {
          image[j].x = position.x
          image[j].y = position.y
          image[j].scale.x = scale
          image[j].scale.y = scale
        }
      } else {
        image.x = position.x
        image.y = position.y
        image.scale.x = scale
        image.scale.y = scale
      }
    }
  }
  setScale(scale) {
    this.scale = scale

    const position = getPixelPosition(this.x, this.z, scale)

    for (let i = 0; i < TILE_IMAGES.length; i++) {
      const image = this.image[TILE_IMAGES[i]]

      if (!image) continue

      if (image instanceof Array) {
        for (let j = 0; j < 6; j++) {
          image[j].x = position.x
          image[j].y = position.y
          image[j].scale.x = scale
          image[j].scale.y = scale
        }
      } else {
        image.x = position.x
        image.y = position.y
        image.scale.x = scale
        image.scale.y = scale
      }
    }
  }

  addCastle() {
    const { x, z, scale, stages } = this

    this.castle = true

    const position = getPixelPosition(x, z, scale)

    this.image.castle = createImage('castle', stages.castles)
    this.image.castle.x = position.x
    this.image.castle.y = position.y
    this.image.castle.scale.x = scale
    this.image.castle.scale.y = scale
    this.image.castle.alpha = 0

    this.animations.push(
      new Animation({
        image: this.image.castle,
        onUpdate: image => {
          const newAlpha = image.alpha + 0.1
          if (newAlpha >= 1) return true
          image.alpha = newAlpha
        },
      })
    )
  }

  setOwner(owner) {
    const { x, z, scale, stages } = this

    this.owner = owner

    if (owner) {
      if (this.image.pattern) {
        this.stages.patterns.removeChild(this.image.pattern)
      }

      const position = getPixelPosition(x, z, scale)

      this.image.pattern = createImage('hexagon', stages.patterns)
      this.image.pattern.tint = hex(owner.pattern)
      this.image.pattern.x = position.x
      this.image.pattern.y = position.y
      this.image.pattern.scale.x = scale
      this.image.pattern.scale.y = scale
      this.image.pattern.alpha = 0

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
  updateNeighbors(tiles) {
    let missingNeighbors = []

    for (let i = 0; i < 6; i++) {
      if (!this.neighbors[i]) {
        missingNeighbors.push(i)
      }
    }

    if (!missingNeighbors.length) return

    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i]

      for (let j = 0; j < missingNeighbors.length; j++) {
        const direction = missingNeighbors[j]

        if (
          tile.x === this.x + NEIGHBOR_DIRECTIONS[direction].x &&
          tile.z === this.z + NEIGHBOR_DIRECTIONS[direction].z
        ) {
          this.neighbors[direction] = tile
          break
        }
      }
    }

    this.updateFogs()
  }
  updateFogs() {
    for (let i = 0; i < 6; i++) {
      if (!this.neighbors[i]) {
        this.image.fog[i].visible = true
      } else {
        this.image.fog[i].visible = false
      }
    }
  }
  updateBorders() {
    for (let i = 0; i < 6; i++) {
      if (this.neighbors[i] && this.neighbors[i].owner !== this.owner) {
        this.image.border[i].visible = true
      } else {
        this.image.border[i].visible = false
      }
    }
  }
}

export default Tile
