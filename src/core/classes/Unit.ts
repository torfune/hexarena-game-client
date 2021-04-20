import {
  UNIT_IMAGE_SCALE,
  UNIT_MAX_DELAY,
} from '../../constants/constants-game'
import roundToDecimals from '../functions/roundToDecimals'
import { Pixel } from '../../types/coordinates'
import { Sprite } from 'pixi.js-legacy'
import { easeOutCubic } from '../functions/easing'
import createImage from '../functions/createImage'
import store from '../store'

class Unit {
  image: Sprite = createImage('army')
  targetPosition: Pixel | null = null
  originalPosition: Pixel | null = null
  delay: number | null = null

  constructor(x: number, y: number) {
    this.image.x = x
    this.image.y = y

    this.image.scale.x = UNIT_IMAGE_SCALE
    this.image.scale.y = UNIT_IMAGE_SCALE
  }

  update(fraction: number) {
    if (this.delay === null || !this.originalPosition || !this.targetPosition) {
      return
    }

    const delayedFraction = 1 / ((1 - this.delay) / (fraction - this.delay))
    if (delayedFraction < 0 && this.delay) return

    const easedFraction = easeOutCubic(delayedFraction)
    const delta = {
      x: this.targetPosition.x - this.originalPosition.x,
      y: this.targetPosition.y - this.originalPosition.y,
    }

    this.image.x = this.originalPosition.x + delta.x * easedFraction
    this.image.y = this.originalPosition.y + delta.y * easedFraction
  }

  moveOn(x: number, y: number) {
    this.targetPosition = { x, y }
    this.originalPosition = {
      x: this.image.x,
      y: this.image.y,
    }

    this.delay = roundToDecimals(Math.random() * UNIT_MAX_DELAY, 2)
  }

  setAlpha(alpha: number) {
    if (alpha < 0) {
      alpha = 0
    }

    if (alpha > 1) {
      alpha = 1
    }

    this.image.alpha = alpha
  }

  destroy() {
    if (!store.game || !store.game.pixi) return

    store.game.pixi.stage.removeChild(this.image)
  }
}

export default Unit
