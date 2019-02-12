import game from '../../game'
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
    owner,
    mountain,
    forest,
    water,
    capital,
    castle,
    village,
    camp,
  }) {
    this.x = x
    this.z = z
    this.owner = owner
    this.water = water
    this.castle = castle
    this.mountain = mountain
    this.forest = forest
    this.capital = capital
    this.village = village
    this.camp = camp
    this.neighbors = [null, null, null, null, null, null]
    this.image = {}
    this.army = null

    const position = getPixelPosition(x, z)

    this.image.background = createImage('background')
    this.image.background.tint = hex('#eee')

    this.image.fog = []
    for (let i = 0; i < 6; i++) {
      this.image.fog[i] = createImage('fog')
      this.image.fog[i].rotation = getRotationBySide(i)
      this.image.fog[i].visible = false
    }

    this.image.border = []
    for (let i = 0; i < 6; i++) {
      this.image.border[i] = createImage('border')
      this.image.border[i].rotation = getRotationBySide(i)
      this.image.border[i].visible = false
    }

    if (capital) {
      this.image.capital = createImage('capital')
    }

    if (castle) {
      this.image.castle = createImage('castle')
    }

    if (village) {
      this.image.village = createImage('village')
    }

    if (camp) {
      this.image.camp = createImage('camp')
    }

    if (water) {
      this.image.water = createImage('water')
    }

    if (mountain) {
      this.image.mountain = createImage('mountain')
    }

    if (forest) {
      this.image.forest = createImage('forest')
    }

    if (owner) {
      this.image.pattern = createImage('pattern')
      this.image.pattern.tint = hex(owner.pattern)
    }

    for (let i = 0; i < TILE_IMAGES.length; i++) {
      const image = this.image[TILE_IMAGES[i]]

      if (!image) continue

      if (image instanceof Array) {
        for (let j = 0; j < 6; j++) {
          image[j].x = position.x
          image[j].y = position.y
          image[j].scale.x = game.scale
          image[j].scale.y = game.scale
        }
      } else {
        image.x = position.x
        image.y = position.y
        image.scale.x = game.scale
        image.scale.y = game.scale
      }
    }
  }
  updateScale() {
    const position = getPixelPosition(this.x, this.z)

    for (let i = 0; i < TILE_IMAGES.length; i++) {
      const image = this.image[TILE_IMAGES[i]]

      if (!image) continue

      if (image instanceof Array) {
        for (let j = 0; j < 6; j++) {
          image[j].x = position.x
          image[j].y = position.y
          image[j].scale.x = game.scale
          image[j].scale.y = game.scale
        }
      } else {
        image.x = position.x
        image.y = position.y
        image.scale.x = game.scale
        image.scale.y = game.scale
      }
    }
  }
  addImage(imageName) {
    const { x, z } = this

    const position = getPixelPosition(x, z)

    this.image[imageName] = createImage(imageName)
    this.image[imageName].x = position.x
    this.image[imageName].y = position.y
    this.image[imageName].scale.x = game.scale
    this.image[imageName].scale.y = game.scale
    this.image[imageName].alpha = 0

    game.animations.push(
      new Animation({
        image: this.image[imageName],
        onUpdate: image => {
          const newAlpha = image.alpha + 0.1
          if (newAlpha >= 1) return true
          image.alpha = newAlpha
        },
      })
    )
  }
  addCapital() {
    this.capital = true
    this.addImage('capital')
  }
  addCastle() {
    this.castle = true
    this.addImage('castle')
  }
  addForest() {
    this.forest = true
    this.addImage('forest')
  }
  addVillage() {
    this.village = true
    this.addImage('village')
  }
  addCamp() {
    this.camp = true
    this.addImage('camp')
  }
  removeCapital() {
    this.capital = false
    game.stage['capital'].removeChild(this.image.capital)
  }
  removeCastle() {
    this.castle = false
    game.stage['castle'].removeChild(this.image.castle)
  }
  removeForest() {
    this.forest = false
    game.stage['forest'].removeChild(this.image.forest)
  }
  removeVillage() {
    this.village = false
    game.stage['village'].removeChild(this.image.village)
  }
  removeCamp() {
    this.camp = false
    game.stage['camp'].removeChild(this.image.camp)
  }
  setOwner(owner) {
    const { x, z } = this

    if (owner) {
      if (this.image.pattern) {
        game.stage['pattern'].removeChild(this.image.pattern)
      }

      const position = getPixelPosition(x, z)

      this.image.pattern = createImage('pattern')
      this.image.pattern.tint = hex(owner.pattern)
      this.image.pattern.x = position.x
      this.image.pattern.y = position.y
      this.image.pattern.scale.x = game.scale
      this.image.pattern.scale.y = game.scale
      this.image.pattern.alpha = 0

      game.animations.push(
        new Animation({
          image: this.image.pattern,
          onUpdate: image => {
            const newAlpha = image.alpha + 0.1
            if (newAlpha >= 1) return true
            image.alpha = newAlpha
          },
        })
      )
    } else if (this.owner) {
      game.stage['pattern'].removeChild(this.image.pattern)
      this.image.pattern = null
    }

    this.owner = owner
  }
  addHighlight() {
    this.image.background.tint = hex('#ddd')
  }
  clearHighlight() {
    this.image.background.tint = hex('#eee')
  }
  addWhiteOverlay() {
    if (!this.image.pattern) return

    this.image.pattern.tint = hex('#fff')
  }
  removeWhiteOverlay() {
    if (!this.image.pattern || !this.owner) return

    this.image.pattern.tint = hex(this.owner.pattern)
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
