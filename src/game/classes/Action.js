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

    const position = getPixelPosition(x, z, scale)

    this.background = new Rectangle(stage, {
      color: '#000',
      position,
      width: ACTION_WIDTH,
      height: ACTION_HEIGHT,
      scale,
      borderRadius: ACTION_BORDER_RADIUS,
      alpha: 0.05,
    })

    this.fill = new Rectangle(stage, {
      color: '#000',
      position,
      width: 0,
      height: ACTION_HEIGHT,
      scale,
      borderRadius: ACTION_BORDER_RADIUS,
      alpha: 0.1,
    })

    this.update()
  }
  update() {
    const { finishedAt, canceledAt, duration } = this
    const now = Date.now()

    if (
      (finishedAt && now >= finishedAt) ||
      (canceledAt && now >= canceledAt)
    ) {
      this.tile.action = null
      this.stage.removeChild(this.background.graphics)
      this.stage.removeChild(this.fill.graphics)
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
}

export default Action
