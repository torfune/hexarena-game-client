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
    status: createProp(null),
  }

  readonly id: string
  readonly type: ActionType
  readonly tile: Tile
  readonly owner: Player
  oldTextureName: string | null = null
  image: Sprite = new Sprite()
  fill: Graphics = new Graphics()
  icon: Sprite = new Sprite(this.getIconTexture())

  constructor(id: string, type: ActionType, tile: Tile, owner: Player) {
    this.id = id
    this.type = type
    this.tile = tile
    this.owner = owner

    if (!store.game) return

    const pixel = getPixelPosition(this.tile.axial)

    this.image.addChild(new Sprite(loader.resources['action-bg'].texture))
    this.image.addChild(this.fill)
    this.image.addChild(this.icon)
    this.image.x = pixel.x
    this.image.y = pixel.y

    this.tile.action = this
    this.update()
    store.game.updateHoveredTileInfo()
    store.game.stage.action.addChild(this.image)
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

    const radius = Math.round(ACTION_RADIUS)

    const startAngle = -Math.PI / 2
    const arcSize = Math.PI * 2 * fraction
    const endAngle = startAngle + arcSize

    this.image.fill.clear()
    this.image.fill.beginFill(hex('#111'))
    this.image.fill.moveTo(0, 0)
    this.image.fill.arc(pixel.x, pixel.y, radius, startAngle, endAngle)
    this.image.fill.endFill()

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
  }
  getIconTexture() {
    switch (this.type) {
      case 'ATTACK':
        return loader.resources['actionIconAttack'].texture
      case 'RECRUIT':
        if (
          store.gsConfig &&
          this.tile.building &&
          this.tile.building.hp < store.gsConfig.HP[this.tile.building.type]
        ) {
          return loader.resources['actionIconHeal'].texture
        } else {
          return loader.resources['actionIconRecruit'].texture
        }
      case 'BUILD':
        return loader.resources['tower-icon'].texture
      case 'UPGRADE':
        return loader.resources['castle-icon'].texture
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
