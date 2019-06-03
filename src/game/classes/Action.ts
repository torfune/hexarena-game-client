import game from '../../game'
import getPixelPosition from '../functions/getPixelPosition'
import hex from '../functions/hex'
import createImage from '../functions/createImage'
import store from '../../store'
import Tile from './Tile'
import Player from './Player'
import Primitive from '../../types/Primitive'
import Prop from '../../types/Prop'
import createProp from '../../utils/createProp'
import createText from '../functions/createText'
import { Sprite, Graphics, Text, loader } from 'pixi.js'

const ACTION_RADIUS = 49

export type ActionType = 'attack' | 'cut' | 'build' | 'recruit'
export type ActionStatus = 'pending' | 'running' | 'finished'

interface Image {
  background: Sprite
  fill: Graphics
  order: Text
  icon: Sprite
  cancelIcon: Sprite
}

interface Props {
  [key: string]: Prop<Primitive>
  duration: Prop<number>
  finishedAt: Prop<number>
  order: Prop<number>
  status: Prop<ActionStatus | null>
}

class Action {
  props: Props = {
    duration: createProp(0),
    finishedAt: createProp(0),
    order: createProp(0),
    status: createProp(null),
  }

  readonly id: string
  readonly type: ActionType
  readonly tile: Tile
  readonly owner: Player
  mouseLeft: boolean = false
  image: Image = {
    background: createImage('actionBg'),
    fill: new Graphics(),
    icon: createImage('actionIcon', 'actionIconEmpty'),
    cancelIcon: createImage('actionIcon', 'actionIconCancel'),
    order: createText('#', 'actionIcon'),
  }

  constructor(id: string, type: ActionType, tile: Tile, owner: Player) {
    this.id = id
    this.type = type
    this.tile = tile
    this.owner = owner

    this.image.cancelIcon.visible = false
    this.image.order.visible = false

    game.stage.actionFill.addChild(this.image.fill)

    this.tile.action = this
    this.update()
  }

  setProp(key: keyof Props, value: Primitive) {
    this.props[key].previous = this.props[key].current
    this.props[key].current = value

    switch (key) {
      case 'status':
        switch (this.status) {
          case 'pending':
            this.image.order.visible = true
            break

          case 'running':
            this.image.order.visible = false

            const { texture } = loader.resources[this.getTexture()]
            this.image.icon.texture = texture
            break

          case 'finished':
            this.destroy()
            break

          default:
            break
        }
        break

      case 'order':
        this.image.order.text = String(this.order)
        break

      default:
        break
    }
  }
  update() {
    const { finishedAt, duration, status } = this
    const timeDelta = finishedAt + store.ping - Date.now()

    let fraction = Math.round((1 - timeDelta / duration) * 100) / 100

    if (fraction < 0 || status === 'pending') {
      fraction = 0
    }

    if (fraction > 1 || status === 'finished') {
      fraction = 1
    }

    const pixel = getPixelPosition(this.tile.axial)
    const radius = Math.round(ACTION_RADIUS * game.scale)

    const startAngle = -Math.PI / 2
    const arcSize = Math.PI * 2 * fraction
    const endAngle = startAngle + arcSize

    this.image.fill.clear()
    this.image.fill.beginFill(hex('#111'))
    this.image.fill.moveTo(pixel.x, pixel.y)
    this.image.fill.arc(pixel.x, pixel.y, radius, startAngle, endAngle)
    this.image.fill.endFill()

    this.image.background.x = pixel.x
    this.image.background.y = pixel.y
    this.image.background.scale.x = game.scale
    this.image.background.scale.y = game.scale

    this.image.icon.x = pixel.x
    this.image.icon.y = pixel.y
    this.image.icon.scale.x = game.scale
    this.image.icon.scale.y = game.scale

    this.image.cancelIcon.x = pixel.x
    this.image.cancelIcon.y = pixel.y
    this.image.cancelIcon.scale.x = game.scale
    this.image.cancelIcon.scale.y = game.scale

    this.image.order.x = pixel.x
    this.image.order.y = pixel.y
    this.image.order.scale.x = game.scale
    this.image.order.scale.y = game.scale

    if (store.hoveredTile !== this.tile) {
      this.mouseLeft = true
    }

    // if (this.mouseLeft) {
    //   if (store.hoveredTile === this.tile) {
    //     this.image.order.visible = false
    //     this.image.icon.visible = false
    //     this.image.cancelIcon.visible = true
    //   } else {
    //     this.image.order.visible = true
    //     this.image.icon.visible = true
    //     this.image.cancelIcon.visible = false
    //   }
    // }
  }
  destroy() {
    store.removeAction(this.id)

    this.tile.action = null

    if (
      game.predictedActionTile &&
      game.predictedActionTile.id === this.tile.id
    ) {
      game.predictedActionTile = null
    }

    game.stage.actionBg.removeChild(this.image.background)
    game.stage.actionFill.removeChild(this.image.fill)
    game.stage.actionIcon.removeChild(this.image.icon)
    game.stage.actionIcon.removeChild(this.image.cancelIcon)
    game.stage.actionIcon.removeChild(this.image.order)
  }
  getTexture() {
    switch (this.type) {
      case 'attack':
        return 'actionIconAttack'
      case 'recruit':
        return 'actionIconRecruit'
      case 'build':
        return 'actionIconBuild'
      case 'cut':
        return 'actionIconCut'
    }
  }

  // Prop getters
  get duration() {
    return this.props.duration.current
  }
  get finishedAt() {
    return this.props.finishedAt.current
  }
  get order() {
    return this.props.order.current
  }
  get status() {
    return this.props.status.current
  }
}

export default Action
