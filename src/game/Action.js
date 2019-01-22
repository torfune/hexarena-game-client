import getPixelPosition from '../utils/getPixelPosition'

import { TILE_RADIUS } from '../constants'

class Action {
  constructor({ tile, two, finishedAt, duration }) {
    this.tile = tile
    this.two = two
    this.finishedAt = finishedAt
    this.duration = duration

    const { x, z, camera, radius } = tile

    const pixel = getPixelPosition(x, z, camera, radius)
    const scale = radius / TILE_RADIUS

    this.background = this.two.makeRoundedRectangle(pixel.x, pixel.y, 64, 8, 4)
    this.background.fill = '#000'
    this.background.noStroke()
    this.background.opacity = 0.1
    this.background.scale = scale

    this.fill = two.makeRoundedRectangle(pixel.x, pixel.y, 0, 8, 4)
    this.fill.fill = '#000'
    this.fill.noStroke()
    this.fill.opacity = 0.5
    this.fill.scale = scale

    this.update()
  }
  update() {
    const { finishedAt, canceledAt, duration } = this
    const now = Date.now()

    if (finishedAt && now >= finishedAt) {
      this.tile.action = null
      this.background.remove()
      this.fill.remove()
      return
    }

    if (canceledAt && now >= canceledAt) {
      this.tile.action = null
      this.background.remove()
      this.fill.remove()
      return
    }

    const { x, z, camera, radius } = this.tile

    const pixel = getPixelPosition(x, z, camera, radius)
    const scale = radius / TILE_RADIUS

    const timeDelta = finishedAt - now
    const percentage = Math.round((1 - timeDelta / duration) * 100) / 100
    const width = 64 * percentage

    this.fill.width = width
    this.fill.translation.x = pixel.x - 32 * scale + (width * scale) / 2
    this.fill.translation.y = pixel.y
    this.fill.scale = scale

    this.background.translation.x = pixel.x
    this.background.translation.y = pixel.y
    this.background.scale = scale
  }
}

export default Action
