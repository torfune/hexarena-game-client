import game from '../../game'
import getPixelPosition from '../functions/getPixelPosition'
import createImage from '../functions/createImage'
import getUniqueRandomizedPositions from '../functions/getUniqueRandomizedPositions'
import calculateFullScaleNumber from '../functions/calculateFullScaleNumber'
import roundToDecimals from '../functions/roundToDecimals'
import { easeOutCubic as ease } from '../functions/easing'
import {
  UNIT_COUNT,
  UNIT_POSITION_OFFSET,
  UNIT_MOVEMENT_SPEED,
  UNIT_RADIUS,
  UNIT_IMAGE_SCALE,
  UNIT_DOOR_OFFSET,
  UNIT_MAX_DELAY,
} from '../../constants'

class Army {
  constructor({ id, tile, ownerId }) {
    this.id = id
    this.ownerId = ownerId
    this.tile = tile
    this.units = []
    this.animationFraction = null
    this.isMoving = false
    this.isDestroying = false
    this.lastScale = game.scale
    this.alpha = 1

    const position = getPixelPosition(tile.x, tile.z)
    const randomizedPositions = getUniqueRandomizedPositions(
      UNIT_COUNT,
      UNIT_RADIUS * game.scale,
      position,
      UNIT_POSITION_OFFSET * game.scale
    )

    const isInside = tile.capital || tile.castle || tile.camp

    for (let i = 0; i < UNIT_COUNT; i++) {
      if (isInside) {
        this.units.push(new Unit(position))
      } else {
        this.units.push(new Unit(randomizedPositions[i]))
      }
    }

    if (isInside) {
      tile.addArmy(this)
    }
  }
  update() {
    if (this.isDestroying) {
      this.alpha -= 0.02

      for (let i = 0; i < UNIT_COUNT; i++) {
        this.units[i].setAlpha(this.alpha)
      }

      if (this.alpha <= 0) {
        for (let i = 0; i < UNIT_COUNT; i++) {
          this.units[i].destroy()
        }

        const index = game.armies.indexOf(this)
        if (index !== -1) {
          game.armies.splice(index, 1)
        }

        return
      }
    }

    if (!this.isMoving) return

    this.animationFraction += UNIT_MOVEMENT_SPEED
    if (this.animationFraction > 1) {
      this.animationFraction = 1
    }

    for (let i = 0; i < UNIT_COUNT; i++) {
      this.units[i].update(this.animationFraction)
    }

    if (this.animationFraction === 1) {
      this.isMoving = false
      this.animationFraction = null
    }
  }
  updateScale() {
    for (let i = 0; i < UNIT_COUNT; i++) {
      this.units[i].updateScale(this.lastScale, game.scale)
    }

    this.lastScale = game.scale
  }
  moveOn(tile) {
    if (tile === this.tile) return

    if (this.tile.army === this) {
      this.tile.removeArmy()
    }

    this.tile = tile
    this.isMoving = true
    this.animationFraction = 0

    const sameOwner = tile.owner && tile.owner.id === this.ownerId
    const position = getPixelPosition(tile.x, tile.z)
    const doorPosition = {
      x: position.x,
      y: position.y + UNIT_DOOR_OFFSET * game.scale,
    }
    const randomizedPositions = getUniqueRandomizedPositions(
      UNIT_COUNT,
      UNIT_RADIUS * game.scale,
      position,
      UNIT_POSITION_OFFSET * game.scale
    )

    for (let i = 0; i < UNIT_COUNT; i++) {
      if (tile.capital || tile.castle) {
        this.units[i].moveOn(doorPosition)
      } else {
        this.units[i].moveOn(randomizedPositions[i])
      }
    }

    if (sameOwner && (tile.capital || tile.castle || tile.camp)) {
      tile.addArmy(this)
    }
  }
  destroy() {
    this.isDestroying = true

    if (this.tile.army && this.tile.army === this) {
      this.tile.removeArmy()
    }
  }
}

class Unit {
  constructor({ x, y }) {
    this.image = createImage('army')
    this.image.x = x
    this.image.y = y
    this.targetPosition = null
    this.originalPosition = null
    this.delay = null

    this.updateScale()
  }
  update(fraction) {
    const delayedFraction = 1 / ((1 - this.delay) / (fraction - this.delay))

    if (delayedFraction < 0) return

    const easedFraction = ease(delayedFraction)
    const delta = {
      x: this.targetPosition.x - this.originalPosition.x,
      y: this.targetPosition.y - this.originalPosition.y,
    }

    this.image.x = this.originalPosition.x + delta.x * easedFraction
    this.image.y = this.originalPosition.y + delta.y * easedFraction
  }
  updateScale(oldScale, newScale) {
    this.image.scale.x = game.scale * UNIT_IMAGE_SCALE
    this.image.scale.y = game.scale * UNIT_IMAGE_SCALE

    if (!oldScale || !newScale) return

    const fullScaleCurrentPosition = {
      x: calculateFullScaleNumber(this.image.x, oldScale),
      y: calculateFullScaleNumber(this.image.y, oldScale),
    }

    this.image.x = fullScaleCurrentPosition.x * newScale
    this.image.y = fullScaleCurrentPosition.y * newScale

    if (this.originalPosition) {
      const fullScaleOriginalPosition = {
        x: calculateFullScaleNumber(this.originalPosition.x, oldScale),
        y: calculateFullScaleNumber(this.originalPosition.y, oldScale),
      }

      this.originalPosition.x = fullScaleOriginalPosition.x * newScale
      this.originalPosition.y = fullScaleOriginalPosition.y * newScale
    }

    if (this.targetPosition) {
      const fullScaleTargetPosition = {
        x: calculateFullScaleNumber(this.targetPosition.x, oldScale),
        y: calculateFullScaleNumber(this.targetPosition.y, oldScale),
      }

      this.targetPosition.x = fullScaleTargetPosition.x * newScale
      this.targetPosition.y = fullScaleTargetPosition.y * newScale
    }
  }
  moveOn({ x, y }) {
    this.targetPosition = { x, y }
    this.originalPosition = {
      x: this.image.x,
      y: this.image.y,
    }

    this.delay = roundToDecimals(Math.random() * UNIT_MAX_DELAY, 2)
  }
  setAlpha(alpha) {
    if (alpha < 0) {
      alpha = 0
    }

    if (alpha > 1) {
      alpha = 1
    }

    this.image.alpha = alpha
  }
  destroy() {
    game.stage['army'].removeChild(this.image)
  }
}

export default Army
