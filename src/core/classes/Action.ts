import getPixelPosition from '../functions/getPixelPosition'
import hex from '../functions/hex'
import store from '../store'
import Tile from './Tile'
import Player from './Player'
import Primitive from '../../types/Primitive'
import Prop from '../../types/Prop'
import createProp from '../../utils/createProp'
import { Sprite, Graphics } from 'pixi.js-legacy'
import Animation from './Animation'
import { easeOutQuad, easeInQuad } from '../functions/easing'
import SoundManager from '../../services/SoundManager'
import getTexture from '../functions/getTexture'
import { IMAGE_Z_INDEX } from '../../constants/constants-game'
import getImageZIndex from '../functions/getImageZIndex'

const ACTION_RADIUS = 50

export type ActionType =
  | 'CAPTURE'
  | 'RECRUIT'
  | 'CAMP'
  | 'TOWER'
  | 'CASTLE'
  | 'HOUSE'
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

    this.background = new Sprite(getTexture('action-bg'))
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
    this.image.zIndex = getImageZIndex('action', { axialZ: tile.axial.z })

    if (owner.id === store.game?.playerId) {
      SoundManager.play('ACTION_CREATE')
    }

    new Animation(
      this.image,
      (image: Sprite, fraction: number, context: any) => {
        image.scale.set(fraction)
        image.alpha = fraction
        context.fill.alpha = fraction
      },
      {
        speed: 0.06,
        ease: easeOutQuad,
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

    if (store.game && store.game.pixi) {
      store.game.pixi.stage.addChild(this.image)
    }
  }

  setProp(key: keyof Props, value: Primitive) {
    if (this.props[key].current === value) return

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
    if (this.status === 'PENDING' || !store.game || store.game.ping === null) {
      return
    }

    const { finishedAt, duration, status } = this
    const timeDelta = finishedAt + store.game.ping - Date.now()
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

    const index = store.game.actions.indexOf(this)
    if (index !== -1) {
      store.game.actions.splice(index, 1)
    }

    this.tile.action = null

    if (this.type === 'RECRUIT' && this.owner.id === store.game.playerId) {
      SoundManager.play('ARMY_CREATE')
    }

    new Animation(
      this.image,
      (image: Sprite, fraction: number) => {
        image.scale.set(1 - fraction)
        image.alpha = 1 - fraction
      },
      {
        speed: 0.06,
        ease: easeInQuad,
        onFinish: () => {
          if (!store.game || !store.game.pixi) return

          store.game.pixi.stage.removeChild(this.image)
        },
      }
    )
  }
  getIconTexture() {
    switch (this.type) {
      case 'CAPTURE':
        return getTexture('action-icon-attack')
      case 'RECRUIT':
        if (
          store.gsConfig &&
          this.tile.building &&
          this.tile.building.hp < store.gsConfig.HP[this.tile.building.type]
        ) {
          return getTexture('action-icon-heal')
        } else {
          return getTexture('action-icon-recruit')
        }
      case 'CAMP':
        return getTexture('action-icon-camp')
      case 'TOWER':
        return getTexture('action-icon-tower')
      case 'CASTLE':
        return getTexture('action-icon-castle')
      case 'HOUSE':
        return getTexture('action-icon-house')
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
