import getPixelPosition from '../utils/getPixelPosition'

import Rectangle from './Rectangle'

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
      width: 64,
      height: 8,
      scale,
      borderRadius: 4,
      alpha: 0.1,
    })

    this.fill = new Rectangle(stage, {
      color: '#000',
      position,
      width: 0,
      height: 8,
      scale,
      borderRadius: 4,
      alpha: 0.5,
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
    const width = 64 * percentage

    this.background.redraw({ position, scale })

    this.fill.redraw({
      width,
      position: {
        x: position.x - 32 * scale + (width * scale) / 2,
        y: position.y,
      },
      scale,
    })
  }
}

export default Action
