import getPixelPosition from '../functions/getPixelPosition'
import hex from '../functions/hex'
import createImage from '../functions/createImage'
import store from '../../store'
import Tile from './Tile'
import Player from './Player'
import Primitive from '../../types/Primitive'
import Prop from '../../types/Prop'
import createProp from '../../utils/createProp'
import { Sprite, Graphics, Text, Loader } from 'pixi.js'

const loader = Loader.shared

const ACTION_RADIUS = 49

export type ActionType = 'ATTACK' | 'BUILD' | 'RECRUIT' | 'UPGRADE'
export type ActionStatus = 'pending' | 'running' | 'finished'

interface Image {
  background: Sprite
  fill: Graphics
  icon: Sprite
  iconBackground: Sprite
  cancelIcon: Sprite
}

interface Props {
  [key: string]: Prop<Primitive>
  duration: Prop<number>
  finishedAt: Prop<number>
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
  oldTextureName: string | null = null
  mouseLeft: boolean = false
  image: Image = {
    background: createImage('actionBg'),
    fill: new Graphics(),
    icon: createImage('actionIcon', 'actionIconEmpty'),
    iconBackground: createImage('actionIconBackground', 'actionIconEmpty'),
    cancelIcon: createImage('actionIcon', 'actionIconCancel'),
  }

  constructor(id: string, type: ActionType, tile: Tile, owner: Player) {
    this.id = id
    this.type = type
    this.tile = tile
    this.owner = owner

    this.image.cancelIcon.visible = false

    if (type === 'UPGRADE' || type === 'BUILD') {
      this.image.icon.alpha = 0.85

      switch (type) {
        case 'UPGRADE':
          this.image.icon.scale.x = 0.28
          this.image.icon.scale.y = 0.28
          break
        case 'BUILD':
          this.image.icon.scale.x = 0.38
          this.image.icon.scale.y = 0.38
          break
      }
    } else {
      this.image.iconBackground.visible = false
    }

    if (!store.game) return
    store.game.stage.actionFill.addChild(this.image.fill)

    this.tile.action = this
    this.update()
  }

  setProp(key: keyof Props, value: Primitive) {
    this.props[key].previous = this.props[key].current
    this.props[key].current = value

    switch (key) {
      case 'status':
        switch (this.status) {
          case 'running':
            const { texture } = loader.resources[this.getTexture()]
            this.image.icon.texture = texture
            break

          case 'finished':
            this.destroy()
            break
        }
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
    const radius = Math.round(ACTION_RADIUS)

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
    this.image.icon.x = pixel.x
    this.image.icon.y = pixel.y
    this.image.iconBackground.x = pixel.x
    this.image.iconBackground.y = pixel.y
    this.image.cancelIcon.x = pixel.x
    this.image.cancelIcon.y = pixel.y

    if (store.hoveredTile !== this.tile) {
      this.mouseLeft = true
    }

    if (this.status === 'running') {
      const textureName = this.getTexture()

      if (this.oldTextureName !== textureName) {
        const { texture } = loader.resources[textureName]
        this.image.icon.texture = texture
        this.oldTextureName = textureName
      }
    }
  }
  destroy() {
    if (!store.game) return

    store.removeAction(this.id)

    this.tile.action = null

    if (
      store.game.predictedActionTile &&
      store.game.predictedActionTile.id === this.tile.id
    ) {
      store.game.predictedActionTile = null
    }

    store.game.stage.actionBg.removeChild(this.image.background)
    store.game.stage.actionFill.removeChild(this.image.fill)
    store.game.stage.actionIcon.removeChild(this.image.icon)
    store.game.stage.actionIconBackground.removeChild(this.image.iconBackground)
    store.game.stage.actionIcon.removeChild(this.image.cancelIcon)
  }
  getTexture() {
    switch (this.type) {
      case 'ATTACK':
        return 'actionIconAttack'
      case 'RECRUIT':
        if (this.tile.building && this.tile.building.hp < 2) {
          return 'actionIconHeal'
        } else {
          return 'actionIconRecruit'
        }
      case 'BUILD':
        return 'tower-icon'
      case 'UPGRADE':
        return 'castle-icon'
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
