import { Sprite } from 'pixi.js'
import store from '../../store'
import roundToDecimals from './roundToDecimals'

interface Options {
  image: Sprite
  duration: number
  onUpdate: (image: Sprite, fraction: number, context: any) => void
  onFinish?: (image: Sprite, context: any) => void
  ease?: 'IN' | 'OUT' | 'IN-OUT'
  delay?: number
  initialFraction?: number
  context?: any
}

const animate = (options: Options) => {
  const animation = new Animation(options)

  if (options.delay) {
    setTimeout(() => {
      if (store.game) {
        store.game.animations.push(animation)
      }
    }, options.delay)
  } else {
    if (store.game) {
      store.game.animations.push(animation)
    }
  }
}

export class Animation {
  image: Sprite
  onUpdate: (image: Sprite, fraction: number, context: any) => void
  onFinish?: (image: Sprite, context: any) => void
  ease: (t: number) => number
  context?: any
  step: number
  fraction: number
  finished: boolean = false

  constructor(options: Options) {
    this.image = options.image
    this.onUpdate = options.onUpdate
    this.onFinish = options.onFinish
    this.ease = easeFunction(options.ease || 'IN-OUT')
    this.fraction = options.initialFraction || 0
    this.context = options.context

    this.step = 16.666 / options.duration
  }
  update() {
    this.fraction = roundToDecimals(this.fraction + this.step, 2)
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
  }
}

export const easeFunction = (easeType: 'IN' | 'OUT' | 'IN-OUT') => {
  switch (easeType) {
    // accelerating from zero velocity
    case 'IN':
      return (t: number) => {
        return t * t * t
      }

    // decelerating to zero velocity
    case 'OUT':
      return (t: number) => {
        return --t * t * t + 1
      }

    // acceleration until halfway, then deceleration
    case 'IN-OUT':
      return (t: number) => {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
      }
  }
}

export default animate
