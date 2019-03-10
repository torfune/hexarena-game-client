import game from '../..'
import calculateFullScaleNumber from '../../functions/calculateFullScaleNumber'
import roundToDecimals from '../../functions/roundToDecimals'
import createImage from '../../functions/createImage'
import { easeOutCubic as ease } from '../../functions/easing'
import { UNIT_IMAGE_SCALE, UNIT_MAX_DELAY } from '../../constants'

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

export default Unit
