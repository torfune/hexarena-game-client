import game from '..'
import { easeInOutQuad } from '../functions/easing'

class Animation {
  updateScale(): any {
    throw new Error('Method not implemented.')
  }
  readonly speed: number = 0.1
  readonly initialFraction: number = 0
  readonly ease: (t: number) => number = easeInOutQuad
  readonly context: any = {}
  fraction: number = 0
  readonly onFinish?: (image: PIXI.Sprite, context: any) => void
  finished: boolean = false

  constructor(
    readonly image: PIXI.Sprite,
    readonly onUpdate: (image: PIXI.Sprite, ease: number, context: any) => void,
    options?: {
      context?: any
      ease?: (t: number) => number
      initialFraction?: number
      onFinish?: (image: PIXI.Sprite, context: any) => void
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

    game.animations.push(this)
  }
  update() {
    this.fraction += this.speed

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
    const index = game.animations.indexOf(this)
    if (index !== -1) {
      game.animations.splice(index, 1)
    }
  }
}

export default Animation
