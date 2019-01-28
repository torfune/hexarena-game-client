import getPixelPosition from '../functions/getPixelPosition'
import Rectangle from './Rectangle'
import {
  ACTION_WIDTH,
  ACTION_HEIGHT,
  ACTION_BORDER_RADIUS,
} from '../../constants'

class Action {
  constructor({ tile, finishedAt, duration }) {
    const { x, z, stage, scale } = tile

    this.tile = tile
    this.finishedAt = finishedAt
    this.duration = duration
    this.stage = stage
    this.isActive = true

    const position = getPixelPosition(x, z, scale)

    this.background = new Rectangle(stage, {
      color: '#000',
      position,
      width: ACTION_WIDTH,
      height: ACTION_HEIGHT,
      scale,
      borderRadius: ACTION_BORDER_RADIUS,
      alpha: 0.1,
      animationStep: 0.01,
    })

    this.fill = new Rectangle(stage, {
      color: '#000',
      position,
      width: 0,
      height: ACTION_HEIGHT,
      scale,
      borderRadius: ACTION_BORDER_RADIUS,
      animationStep: 0.03,
      alpha: 0.3,
    })

    this.update()
  }
  update() {
    const { finishedAt, canceledAt, duration } = this
    const now = Date.now()

    if (!this.isActive) {
      this.background.redraw({})
      this.fill.redraw({})

      if (this.background.alpha <= 0) {
        this.stage.removeChild(this.background.graphics)
        this.stage.removeChild(this.fill.graphics)
        this.tile.action = null
      }

      return
    }

    if (
      (finishedAt && now >= finishedAt) ||
      (canceledAt && now >= canceledAt)
    ) {
      this.destroy()
      return
    }

    const { x, z, scale } = this.tile

    const position = getPixelPosition(x, z, scale)
    const timeDelta = finishedAt - now
    const percentage = Math.round((1 - timeDelta / duration) * 100) / 100
    const width = ACTION_WIDTH * percentage

    this.background.redraw({ position, scale })
    this.fill.redraw({
      width,
      position: {
        x: position.x - (ACTION_WIDTH / 2) * scale + (width * scale) / 2,
        y: position.y,
      },
      scale,
    })
  }
  destroy() {
    this.isActive = false

    this.background.targetAlpha = 0
    this.background.animationStep *= -1

    this.fill.targetAlpha = 0
    this.fill.animationStep *= -1
    this.fill.defaultOptions.width = this.fill.width
  }
}

export default Action
