import createImage from '../../functions/createImage'
import { UNIT_SPEED, UNIT_SCALE } from '../../../constants/game'
import { Pixel } from '../../../types/coordinates'
import { Sprite } from 'pixi.js'
import store from '../../../store'
import animate, { easeFunction } from '../../functions/animate'

class Unit {
  image: Sprite = createImage(['army', 'unit'])
  targetPixel: Pixel | null = null
  originPixel: Pixel | null = null
  targetScale = UNIT_SCALE.NORMAL
  originScale = UNIT_SCALE.NORMAL
  delay: number = 0
  fraction: number = 1
  destroying: boolean = false
  animateAlpha: boolean = false

  constructor(pixel: Pixel) {
    this.image.x = pixel.x
    this.image.y = pixel.y
    this.image.scale.x = UNIT_SCALE.NORMAL
    this.image.scale.y = UNIT_SCALE.NORMAL
  }
  update() {
    if (!this.originPixel || !this.targetPixel) {
      return
    }

    this.fraction += UNIT_SPEED
    if (this.fraction > 1) {
      this.fraction = 1
    }

    const delayedFraction =
      1 / ((1 - this.delay) / (this.fraction - this.delay))
    if (delayedFraction < 0 && this.delay > 0) return

    const easedFraction = easeFunction('OUT')(delayedFraction)
    const delta = {
      x: this.targetPixel.x - this.originPixel.x,
      y: this.targetPixel.y - this.originPixel.y,
    }
    const rotation = Math.atan2(
      this.targetPixel.x - this.originPixel.x,
      -(this.targetPixel.y - this.originPixel.y)
    )

    this.image.x = this.originPixel.x + delta.x * easedFraction
    this.image.y = this.originPixel.y + delta.y * easedFraction
    this.image.rotation = rotation

    if (this.originScale !== this.targetScale) {
      this.image.scale.set(
        this.originScale + (this.targetScale - this.originScale) * easedFraction
      )
    }

    if (this.animateAlpha) {
      this.image.alpha = 1 - this.fraction
    }

    if (this.destroying && this.fraction === 1) {
      this.clear()
    }
  }
  moveOn(pixel: Pixel, delay?: number) {
    this.targetPixel = pixel
    this.originPixel = {
      x: this.image.x,
      y: this.image.y,
    }
    this.originScale = UNIT_SCALE.NORMAL
    this.targetScale = UNIT_SCALE.NORMAL
    this.image.scale.set(UNIT_SCALE.NORMAL)
    this.delay = delay || 0
    this.fraction = 0
    this.animateAlpha = false
    this.image.alpha = 1
  }
  moveIn(pixel: Pixel, delay?: number) {
    this.moveOn(pixel, delay)
    this.resize('SMALL')
    this.animateAlpha = true
  }
  resize(size: 'SMALL' | 'NORMAL') {
    if (size === 'SMALL') {
      this.originScale = UNIT_SCALE.NORMAL
      this.targetScale = UNIT_SCALE.SMALL
    } else {
      this.originScale = UNIT_SCALE.SMALL
      this.targetScale = UNIT_SCALE.NORMAL
    }
  }
  fight(pixel: Pixel) {
    this.moveOn(pixel)
    this.destroy(false)
  }
  destroy(doAnimate: boolean = true) {
    this.destroying = true

    if (doAnimate) {
      this.originScale = UNIT_SCALE.NORMAL
      this.targetScale = UNIT_SCALE.NORMAL
    } else {
      this.animateAlpha = true
      if (this.fraction === 1) {
        this.clear()
      }
      return
    }

    animate({
      image: this.image,
      delay: 400,
      duration: 200,
      context: this,
      ease: 'OUT',
      onUpdate: (image, fraction) => {
        image.alpha = 1 - fraction
        image.scale.set(
          UNIT_SCALE.NORMAL + (UNIT_SCALE.LARGE - UNIT_SCALE.NORMAL) * fraction
        )
      },
      onFinish: (_, unit) => {
        if (this.fraction === 1) {
          unit.clear()
        }
      },
    })
  }
  clear() {
    if (!store.game) return

    const stage = store.game.stage.get('army')
    if (stage) {
      stage.removeChild(this.image)
    }

    const index = store.game.units.indexOf(this)
    if (index !== -1) {
      store.game.units.splice(index, 1)
    }
  }
}

export default Unit
