import game from '..'
import { easeInOutQuad } from '../functions/easing'

class Animation {
  constructor({ image, speed, ease, context, onUpdate, onFinish }) {
    this.ease = ease || easeInOutQuad
    this.context = context
    this.speed = speed
    this.fraction = 0
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

    if (this.fraction === 1) {
      if (this.onFinish) {
        this.onFinish(this.image, this.context)
      }

      this.finished = true
    }
  }
}

export default Animation
