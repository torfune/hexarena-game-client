import getPixelPosition from '../functions/getPixelPosition'
import createImage from '../functions/createImage'

const unitsCount = 1

class Army {
  constructor(tile) {
    this.tile = tile
    this.units = []

    const position = getPixelPosition(tile.x, tile.z)

    for (let i = 0; i < unitsCount; i++) {
      this.units.push(new Unit(position.x, position.y))
    }
  }
  update() {
    for (let i = 0; i < unitsCount; i++) {
      this.units[i].moveOn(position.x, position.y)
    }
  }
  moveOn(tile) {
    this.tile = tile

    const position = getPixelPosition(tile.x, tile.z)

    for (let i = 0; i < unitsCount; i++) {
      this.units[i].moveOn(position.x, position.y)
    }
  }
}

class Unit {
  constructor(x, y) {
    this.image = createImage('army')
    this.image.x = x
    this.image.y = y
    this.isMoving = false
  }
  moveOn(x, y) {
    this.image.x = x
    this.image.y = y
  }
}

export default Army
