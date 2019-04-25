import game from '../../game'
import getPixelPosition from '../functions/getPixelPosition'
import hex from '../functions/hex'
import createImage from '../functions/createImage'
import store from '../../store'

const ACTION_RADIUS = 49

class Action {
  constructor({
    id,
    type,
    tileId,
    ownerId,
    status,
    duration,
    finishedAt,
    order,
  }) {
    const tile = store.getItem('tiles', tileId)
    const owner = store.getItem('players', ownerId)

    if (!tile || !owner || status === 'done') return

    this.id = id
    this.type = type
    this.tileId = tileId
    this.tile = tile
    this.ownerId = ownerId
    this.owner = owner
    this.status = status
    this.duration = duration
    this.finishedAt = finishedAt
    this.order = order

    this.fill = new PIXI.Graphics()
    this.background = createImage('actionBg')
    this.cancelIcon = createImage('actionIcon', 'actionIconCancel')
    this.cancelIcon.visible = false
    this.mouseLeft = false
    this.hidden = false
    this.icon = createImage(
      'actionIcon',
      this.status === 'running' ? getActionTexture(type) : 'actionIconEmpty'
    )

    if (this.status !== 'running') {
      this.number = new PIXI.Text(
        this.order,
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
    this.update()
  }
  set(key, value) {
    this[key] = value

    switch (key) {
      case 'status':
        switch (this.status) {
          case 'done':
            this.destroy()
            break

          case 'running':
            game.stage.actionIcon.removeChild(this.icon)
            game.stage.actionIcon.removeChild(this.number)
            this.icon = createImage('actionIcon', getActionTexture(this.type))
            break

          default:
            break
        }
        break

      case 'order':
        if (this.number) {
          this.number.text = this.order
        }
        break

      default:
        break
    }
  }
  update() {
    const { finishedAt, duration } = this
    const timeDelta = finishedAt - Date.now()

    let fraction = Math.round((1 - timeDelta / duration) * 100) / 100

    if (fraction < 0 || this.status === 'pending') {
      fraction = 0
    }

    if (fraction > 1 || this.status === 'done') {
      fraction = 1
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

    if (this.hidden) {
      const images = ['fill', 'background', 'icon', 'cancelIcon', 'number']
      for (const image of images) {
        if (this[image]) {
          this[image].visible = false
        }
      }
    }

    if (fraction === 1 && !this.hidden) {
      setTimeout(
        (() => {
          this.hidden = true
        }).bind(this),
        80
      )
    }
  }
  destroy() {
    store.removeItem('actions', this.id)

    this.tile.action = null

    if (
      game.predictedActionTile &&
      game.predictedActionTile.id === this.tile.id
    ) {
      game.predictedActionTile = null
    }

    game.stage.actionBg.removeChild(this.background)
    game.stage.actionFill.removeChild(this.fill)
    game.stage.actionIcon.removeChild(this.icon)
    game.stage.actionIcon.removeChild(this.cancelIcon)
    game.stage.actionIcon.removeChild(this.number)
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
