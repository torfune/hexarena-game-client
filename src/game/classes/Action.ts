import getPixelPosition from '../functions/pixelFromAxial'
import hex from '../functions/hex'
import store from '../../store'
import Tile from './Tile'
import Player from './Player'
import Primitive from '../../types/Primitive'
import Prop from '../../types/Prop'
import createProp from '../../utils/createProp'
import { Sprite, Graphics, Loader } from 'pixi.js'
import animate from '../functions/animate'

const loader = Loader.shared
const ACTION_RADIUS = 50

export type ActionType = 'TOWER' | 'CASTLE'
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

    animate({
      image: this.image,
      duration: 200,
      context: this.fill,
      ease: 'OUT',
      onUpdate: (image, fraction, fill) => {
        image.scale.set(fraction)
        image.alpha = fraction
        fill.alpha = fraction
      },
    })

    this.tile.action = this

    setTimeout(() => {
      if (this.status === 'PENDING') {
        this.destroy()
      }
    }, 1000)

    if (store.game) {
      const stage = store.game.stage.get('action')
      if (stage) {
        stage.addChild(this.image)
      }
    }

    const textureName = this.type === 'TOWER' ? 'tower-icon' : 'castle-icon'
    this.tile.addBuildPreview(textureName)
  }
  updateProps(props: string[]) {
    if (!store.game) return

    for (let i = 0; i < props.length; i++) {
      switch (props[i]) {
        case 'status':
          switch (this.status) {
            case 'FINISHED':
              this.destroy()
              break
          }
          break
      }
    }
  }
  update() {
    if (this.status === 'PENDING' || !store.game) return

    const { finishedAt, duration, status } = this
    const timeDelta = finishedAt + store.game.timeDiff - Date.now()
    let fraction = 1 - timeDelta / duration

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

    animate({
      image: this.image,
      duration: 200,
      ease: 'IN',
      onUpdate: (image, fraction) => {
        image.scale.set(1 - fraction)
        image.alpha = 1 - fraction
      },
      onFinish: image => {
        if (!store.game) return
        const stage = store.game.stage.get('action')
        if (stage) {
          stage.removeChild(image)
        }
      },
    })

    this.tile.removeBuildPreview()
  }
  getIconTexture() {
    return loader.resources['action-icon-build'].texture
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
