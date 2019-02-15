import game from '..'
import { easeInOutQuad } from '../functions/easing'

class Animation {
  constructor({
    image,
    speed,
    initialFraction,
    ease,
    context,
    onUpdate,
    onFinish,
  }) {
    if (!game.isRunning) return

    this.ease = ease || easeInOutQuad
    this.context = context
    this.speed = speed || 0.1
    this.fraction = initialFraction || 0
    this.image = image
    this.onUpdate = onUpdate
    this.onFinish = onFinish
    this.finished = false

    game.animations.push(this)
  }
  update = () => {
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
