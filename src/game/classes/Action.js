import * as PIXI from 'pixi.js'

import game from '../../game'
import getPixelPosition from '../functions/getPixelPosition'
import hex from '../functions/hex'
import createImage from '../functions/createImage'

const ACTION_RADIUS = 49

class Action {
  constructor({ tile, finishedAt, duration, type, isActive, number }) {
    this.tile = tile
    this.finishedAt = finishedAt
    this.duration = duration
    this.isActive = isActive || false
    this.type = type

    const iconTexture = this.isActive
      ? getActionTexture(type)
      : 'actionIconEmpty'

    this.fill = new PIXI.Graphics()
    this.background = createImage('actionBg')
    this.icon = createImage('actionIcon', iconTexture)
    this.cancelIcon = createImage('actionIcon', 'actionIconCancel')

    this.mouseLeft = false
    this.cancelIcon.visible = false

    if (!this.isActive) {
      this.number = new PIXI.Text(
        number,
        new PIXI.TextStyle({
          fontFamily: 'Montserrat',
          fontSize: 44,
          fontWeight: 600,
          fill: '#333',
        })
      )

      this.number.anchor.set(0.5, 0.5)
      game.stage.actionIcon.addChild(this.number)
    }

    game.stage.actionFill.addChild(this.fill)

    this.tile.action = this
    game.actions.push(this)
    this.update()
  }
  activate(finishedAt, duration) {
    this.finishedAt = finishedAt
    this.duration = duration
    this.isActive = true

    game.stage.actionIcon.removeChild(this.icon)
    game.stage.actionIcon.removeChild(this.number)

    this.icon = createImage('actionIcon', getActionTexture(this.type))
  }
  setNumber(number) {
    if (!this.number) return

    this.number.text = number
  }
  update() {
    const { finishedAt, duration } = this
    const now = Date.now() + game.timeDiff
    const timeDelta = finishedAt - now

    let fraction = Math.round((1 - timeDelta / duration) * 100) / 100
    if (fraction < 0 || !this.isActive) {
      fraction = 0
    }

    const position = getPixelPosition(this.tile.x, this.tile.z)
    const radius = Math.round(ACTION_RADIUS * game.scale)

    const startAngle = -Math.PI / 2
    const arcSize = Math.PI * 2 * fraction
    const endAngle = startAngle + arcSize

    this.fill.clear()
    this.fill.beginFill(hex('#111'))
    this.fill.moveTo(position.x, position.y)
    this.fill.arc(position.x, position.y, radius, startAngle, endAngle)
    this.fill.endFill()

    this.background.x = position.x
    this.background.y = position.y
    this.background.scale.x = game.scale
    this.background.scale.y = game.scale

    this.icon.x = position.x
    this.icon.y = position.y
    this.icon.scale.x = game.scale
    this.icon.scale.y = game.scale

    this.cancelIcon.x = position.x
    this.cancelIcon.y = position.y
    this.cancelIcon.scale.x = game.scale
    this.cancelIcon.scale.y = game.scale

    if (this.number) {
      this.number.x = position.x
      this.number.y = position.y
      this.number.scale.x = game.scale
      this.number.scale.y = game.scale
    }

    if (fraction >= 1) {
      this.destroy()
    }

    if (game.hoveredTile !== this.tile) {
      this.mouseLeft = true
    }

    if (this.mouseLeft) {
      if (game.hoveredTile === this.tile) {
        if (this.number) {
          this.number.visible = false
        }

        this.icon.visible = false
        this.cancelIcon.visible = true
      } else {
        if (this.number) {
          this.number.visible = true
        }

        this.icon.visible = true
        this.cancelIcon.visible = false
      }
    }
  }
  destroy() {
    const index = game.actions.indexOf(this)
    if (index !== -1) {
      game.actions.splice(index, 1)
    }

    this.tile.action = null

    game.stage.actionBg.removeChild(this.background)
    game.stage.actionFill.removeChild(this.fill)
    game.stage.actionIcon.removeChild(this.icon)
    game.stage.actionIcon.removeChild(this.cancelIcon)
    game.stage.actionIcon.removeChild(this.number)

    game.updateHighlights()
  }
}

const getActionTexture = type => {
  switch (type) {
    case 'attack':
      return 'actionIconAttack'

    case 'recruit':
      return 'actionIconRecruit'

    case 'build':
      return 'actionIconBuild'

    case 'cut':
      return 'actionIconCut'

    default:
      throw new Error(`Invalid action type: ${type}`)
  }
}

export default Action
