import { easeInOutQuad } from '../functions/easing'
import { Sprite } from 'pixi.js'
import store from '../store'
import roundToDecimals from '../functions/roundToDecimals'
import { Graphics } from 'pixi.js'

class Animation {
  readonly speed: number = 0.1
  readonly initialFraction: number = 0
  readonly ease: (t: number) => number = easeInOutQuad
  readonly context: any = {}
  fraction: number = 0
  readonly onFinish?: (image: Sprite | Graphics, context: any) => void
  finished: boolean = false

  constructor(
    readonly image: Sprite | Graphics,
    readonly onUpdate: (
      image: Sprite | Graphics,
      ease: number,
      context: any
    ) => void,
    options?: {
      context?: any
      ease?: (t: number) => number
      initialFraction?: number
      onFinish?: (image: Sprite | Graphics, context: any) => void
      speed?: number
    }
  ) {
    if (options) {
      const { speed, initialFraction, ease, context, onFinish } = options

      this.context = context || this.context
      this.ease = ease || this.ease
      this.fraction = initialFraction || this.fraction
      this.initialFraction = initialFraction || this.initialFraction
      this.onFinish = onFinish || this.onFinish
      this.speed = speed || this.speed
    }

    if (store.game) {
      store.game.animations.push(this)
    }
  }
  update(delta: number) {
    this.fraction = roundToDecimals(this.fraction + this.speed * delta, 2)

    if (this.fraction > 1) {
      this.fraction = 1
    }

    this.onUpdate(this.image, this.ease(this.fraction), this.context)

    if (this.fraction === 1 || isNaN(this.fraction)) {
      if (this.onFinish) {
        this.onFinish(this.image, this.context)
      }

      this.finished = true
    }
  }
  destroy = () => {
    if (!store.game) return

    const index = store.game.animations.indexOf(this)
    if (index !== -1) {
      store.game.animations.splice(index, 1)
    }

    if (this.onFinish) {
      this.onFinish(this.image, this.context)
    }
  }
}

export default Animation
