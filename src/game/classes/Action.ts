import getPixelPosition from '../functions/getPixelPosition'
import hex from '../functions/hex'
import store from '../../store'
import Tile from './Tile'
import Player from './Player'
import Primitive from '../../types/Primitive'
import Prop from '../../types/Prop'
import createProp from '../../utils/createProp'
import { Sprite, Graphics, Loader } from 'pixi.js'
import Animation from '../classes/Animation'

const loader = Loader.shared
const ACTION_RADIUS = 50

export type ActionType = 'ATTACK' | 'BUILD' | 'RECRUIT' | 'UPGRADE'
export type ActionStatus = 'PENDING' | 'RUNNING' | 'FINISHED'

interface Props {
  [key: string]: Prop<Primitive>
  duration: Prop<number>
  finishedAt: Prop<number>
  status: Prop<ActionStatus>
}

class Action {
  props: Props = {
    duration: createProp(0),
    finishedAt: createProp(0),
    status: createProp('PENDING'),
  }

  readonly id: string
  readonly type: ActionType
  readonly tile: Tile
  readonly owner: Player
  image: Sprite = new Sprite()
  fill: Graphics = new Graphics()
  icon: Sprite
  background: Sprite

  constructor(id: string, type: ActionType, tile: Tile, owner: Player) {
    this.id = id
    this.type = type
    this.tile = tile
    this.owner = owner

    const pixel = getPixelPosition(this.tile.axial)

    this.background = new Sprite(loader.resources['action-bg'].texture)
    this.background.anchor.set(0.5)
    this.icon = new Sprite(this.getIconTexture())
    this.icon.anchor.set(0.5)
    this.icon.scale.set(0.55)
    this.fill.alpha = 0

    this.image.addChild(this.background)
    this.image.addChild(this.fill)
    this.image.addChild(this.icon)
    this.image.anchor.set(0.5)
    this.image.scale.set(0)
    this.image.alpha = 0
    this.image.x = pixel.x
    this.image.y = pixel.y

    new Animation(
      this.image,
      (image: Sprite, fraction: number, context: any) => {
        image.scale.set(fraction)
        image.alpha = fraction
        context.fill.alpha = fraction
      },
      {
        speed: 0.06,
        context: {
          fill: this.fill,
        },
      }
    )

    this.tile.action = this

    setTimeout(() => {
      if (this.status === 'PENDING') {
        this.destroy()
      }
    }, 1000)

    if (store.game) {
      store.game.updateHoveredTileInfo()
      store.game.stage.action.addChild(this.image)
    }
  }

  setProp(key: keyof Props, value: Primitive) {
    this.props[key].previous = this.props[key].current
    this.props[key].current = value

    switch (key) {
      case 'status':
        switch (this.status) {
          case 'FINISHED':
            this.destroy()
            break
        }
        break

      default:
        break
    }
  }
  update() {
    if (this.status === 'PENDING') return

    const { finishedAt, duration, status } = this
    const timeDelta = finishedAt + store.ping - Date.now()
    let fraction = Math.round((1 - timeDelta / duration) * 100) / 100

    if (fraction > 1 || status === 'FINISHED') {
      fraction = 1
    }

    if (fraction < 0) {
      fraction = 0
    }

    const startAngle = -Math.PI / 2
    const arcSize = Math.PI * 2 * fraction
    const endAngle = startAngle + arcSize

    this.fill.clear()
    this.fill.beginFill(hex('#222'))
    this.fill.moveTo(0, 0)
    this.fill.arc(0, 0, ACTION_RADIUS, startAngle, endAngle)
    this.fill.endFill()
  }
  destroy() {
    if (!store.game) return

    store.removeAction(this.id)
    this.tile.action = null

    new Animation(
      this.image,
      (image: Sprite, fraction: number) => {
        image.scale.set(1 - fraction)
        image.alpha = 1 - fraction
      },
      {
        speed: 0.06,
        onFinish: () => {
          store.game.stage.action.removeChild(this.image)
        },
      }
    )
  }
  getIconTexture() {
    switch (this.type) {
      case 'ATTACK':
        return loader.resources['action-icon-attack'].texture
      case 'RECRUIT':
        if (
          store.gsConfig &&
          this.tile.building &&
          this.tile.building.hp < store.gsConfig.HP[this.tile.building.type]
        ) {
          return loader.resources['action-icon-heal'].texture
        } else {
          return loader.resources['action-icon-recruit'].texture
        }
      case 'BUILD':
        return loader.resources['action-icon-build'].texture
      case 'UPGRADE':
        return loader.resources['action-icon-upgrade'].texture
    }
  }

  // Prop getters
  get duration() {
    return this.props.duration.current
  }
  get finishedAt() {
    return this.props.finishedAt.current
  }
  get status() {
    return this.props.status.current
  }
}

export default Action
