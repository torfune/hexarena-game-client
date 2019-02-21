import * as PIXI from 'pixi.js'

import game from '../../game'
import getPixelPosition from '../functions/getPixelPosition'
import hex from '../functions/hex'

const ACTION_RADIUS = 48

class Action {
  constructor({ tile, finishedAt, duration }) {
    this.tile = tile
    this.finishedAt = finishedAt
    this.duration = duration
    this.isActive = true

    this.fill = new PIXI.Graphics()
    this.background = new PIXI.Graphics()
    this.iconBackground = new PIXI.Graphics()

    this.tile.action = this
    game.stage.action.addChild(this.background)
    game.stage.action.addChild(this.fill)
    game.stage.action.addChild(this.iconBackground)
    game.actions.push(this)

    this.update()
  }
  update() {
    const { finishedAt, duration } = this
    const now = Date.now() + game.timeDiff
    const timeDelta = finishedAt - now

    let fraction = Math.round((1 - timeDelta / duration) * 100) / 100
    if (fraction < 0) {
      fraction = 0
    }

    const position = getPixelPosition(this.tile.x, this.tile.z)
    const radius = Math.round(ACTION_RADIUS * game.scale)

    this.background.clear()
    this.background.beginFill(hex('#fff'))
    this.background.drawCircle(0, 0, radius - 1)
    this.background.endFill()
    this.background.x = position.x
    this.background.y = position.y

    const startAngle = -Math.PI / 2
    const arcSize = Math.PI * 2 * fraction
    const endAngle = startAngle + arcSize

    this.fill.clear()
    this.fill.beginFill(hex('#111'))
    this.fill.moveTo(position.x, position.y)
    this.fill.arc(position.x, position.y, radius, startAngle, endAngle)
    this.fill.endFill()

    this.iconBackground.clear()
    this.iconBackground.beginFill(hex('#fff'))
    this.iconBackground.drawCircle(0, 0, radius - radius / 3)
    this.iconBackground.endFill()
    this.iconBackground.x = position.x
    this.iconBackground.y = position.y

    if (fraction >= 1) {
      this.destroy()
    }
  }
  destroy() {
    const index = game.actions.indexOf(this)
    if (index !== -1) {
      game.actions.splice(index, 1)
    }

    this.tile.action = null

    game.stage.action.removeChild(this.background)
    game.stage.action.removeChild(this.fill)
    game.stage.action.removeChild(this.iconBackground)

    game.updateHighlights()
  }
}

export default Action
