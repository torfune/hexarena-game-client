import getPixelPosition from '../functions/getPixelPosition'
import store from '../store'
import Tile from './Tile'
import Player from './Player'
import { Sprite, Texture } from 'pixi.js-legacy'
import Animation from './Animation'
import { easeOutCubic, easeOutQuad } from '../functions/easing'
import SoundManager from '../../services/SoundManager'
import createImage from '../functions/createImage'
import getImageAnimation from '../functions/getImageAnimation'
import getTexture from '../functions/getTexture'
import { IMAGE_Z_INDEX } from '../../constants/constants-game'
import hex from '../functions/hex'
import getImageZIndex from '../functions/getImageZIndex'

const BAR_MASK_WIDTH = 140
const BAR_OFFSET_Y = 36
const FILL_MASK_HEIGHT = 100
const BUILDING_PREVIEW_ALPHA = 0.25
const PREVIEW_ICON_ALPHA = 0.8
const DESTROY_ANIMATION_SPEED = 0.08
const ARMY_MODE_ALPHA = 0.75
const ARMY_MODE_OFFSET_Y = {
  CAMP: 102,
  TOWER: 120,
  CASTLE: 120,
  CAPITAL: 120,
}

export type ActionType =
  | 'RECRUIT_ARMY'
  | 'BUILD_CAMP'
  | 'BUILD_TOWER'
  | 'BUILD_CASTLE'
  | 'REBUILD_VILLAGE'
export type ActionStatus =
  | 'PREVIEW'
  | 'PENDING'
  | 'RUNNING'
  | 'PAUSED'
  | 'FINISHED'
  | 'QUEUED'

class Action {
  readonly id: string
  readonly type: ActionType
  readonly tile: Tile
  readonly owner: Player
  duration = 0
  finishedAt = 0
  status: ActionStatus
  automated = false
  backgroundImage: Sprite = new Sprite()
  fillImage: Sprite = new Sprite()
  fillImageMask: Sprite = new Sprite()
  iconImage: Sprite = new Sprite()
  barImage: Sprite | null = null
  barFillImage: Sprite | null = null
  barFillImageMask: Sprite | null = null
  buildingPreviewImage: Sprite | null = null
  automatedImage: Sprite | null = null
  baseY: number
  armyModeActive = false

  constructor(
    id: string,
    type: ActionType,
    status: 'PREVIEW' | 'RUNNING' | 'PAUSED' | 'QUEUED',
    tile: Tile,
    owner: Player
  ) {
    if (tile.action) {
      tile.action.destroy()
    }

    this.id = id
    this.type = type
    this.tile = tile
    this.owner = owner
    this.status = status

    const pixel = getPixelPosition(this.tile.axial)
    this.baseY = pixel.y - this.getImageOffsetY()

    this.backgroundImage = createImage('action-background', {
      axialZ: tile.axial.z,
      zIndex: IMAGE_Z_INDEX.indexOf('action'),
    })
    this.backgroundImage.x = pixel.x
    this.backgroundImage.y = this.baseY
    this.backgroundImage.alpha = 0

    const textureName =
      this.status === 'PAUSED' || this.status === 'QUEUED'
        ? 'action-icon-pause'
        : this.getTextureName()
    this.iconImage = new Sprite(getTexture(textureName))
    this.iconImage.alpha = 1
    this.iconImage.anchor.set(0.5, 0.5)

    this.backgroundImage.addChild(this.iconImage)

    if (
      status === 'PREVIEW' &&
      (type === 'BUILD_CAMP' ||
        type === 'BUILD_TOWER' ||
        type === 'BUILD_CASTLE')
    ) {
      this.createBuildingPreviewImage(type)
    }

    if (
      this.status === 'RUNNING' ||
      this.status === 'PAUSED' ||
      this.status === 'QUEUED'
    ) {
      this.createBarImage()
      this.createFillImage()
    }

    new Animation(
      this.backgroundImage,
      (image, fraction) => {
        image.scale.set(fraction)
        image.alpha = fraction * this.getAlpha()
        this.fillImage.alpha = fraction * this.getAlpha()
      },
      {
        speed: 0.1,
        ease: easeOutQuad,
      }
    )

    this.tile.action = this
    if (store.game) {
      store.game.actions.push(this)
    }
  }

  update() {
    if (!this.finishedAt || !this.duration) return

    if (
      !this.barFillImage ||
      !this.barFillImageMask ||
      !this.fillImage ||
      !this.fillImageMask
    ) {
      return
    }

    const { finishedAt, duration } = this
    const timeDelta = finishedAt + store.game!.ping! - Date.now()
    let fraction = Math.round((1 - timeDelta / duration) * 100) / 100

    if (fraction > 1) {
      fraction = 1
    }

    if (fraction < 0) {
      fraction = 0
    }

    if (this.status !== 'RUNNING' && this.status !== 'PAUSED') {
      fraction = 0
    }

    this.barFillImageMask.width = fraction * BAR_MASK_WIDTH
    this.fillImageMask.height = fraction * FILL_MASK_HEIGHT
  }

  getTextureName() {
    switch (this.type) {
      case 'RECRUIT_ARMY':
        if (
          store.gsConfig &&
          this.tile.building &&
          this.tile.building.hp < store.gsConfig.HP[this.tile.building.type]
        ) {
          return 'action-icon-repair'
        } else {
          return 'action-icon-recruit'
        }
      case 'BUILD_CAMP':
        return 'action-icon-camp'
      case 'BUILD_TOWER':
        return 'action-icon-tower'
      case 'BUILD_CASTLE':
        return 'action-icon-castle'
      case 'REBUILD_VILLAGE':
        return 'action-icon-repair'
      default:
        throw Error(`Unsupported action type: ${this.type}`)
    }
  }

  getImageOffsetY() {
    switch (this.type) {
      case 'RECRUIT_ARMY':
        if (this.tile.building?.type === 'CAPITAL') {
          return 145
        } else {
          return 122
        }
      case 'BUILD_CAMP':
        return 105
      case 'BUILD_TOWER':
        return 122
      case 'BUILD_CASTLE':
        return 122
      case 'REBUILD_VILLAGE':
        return 65
    }
  }

  confirm() {
    if (this.status !== 'PREVIEW' || !store.socket) return

    const { x, z } = this.tile.axial
    store.socket.send('action', `${this.id}|${x}|${z}|${this.type}`)

    this.status = 'PENDING'
    this.backgroundImage.alpha = 1
    this.createBarImage()
    this.createFillImage()

    SoundManager.play('ACTION_CREATE')

    setTimeout(() => {
      if (this.status === 'PENDING') {
        this.destroy()
      }
    }, 1000)
  }

  setStatus(newStatus: ActionStatus) {
    if (newStatus === 'PAUSED' || newStatus === 'QUEUED') {
      this.iconImage.texture = getTexture('action-icon-pause')
      if (this.barImage) {
        this.barImage.visible = false
      }
    } else {
      this.iconImage.texture = getTexture(this.getTextureName())
      if (this.barImage) {
        this.barImage.visible = true
      }
    }

    this.status = newStatus
    this.update()
  }

  setDuration(newDuration: number) {
    this.duration = newDuration
  }

  setFinishedAt(newFinishedAt: number) {
    this.finishedAt = newFinishedAt
  }

  setAutomated(newAutomated: boolean) {
    this.automated = newAutomated

    // Create image
    if (this.automated && !this.automatedImage) {
      this.automatedImage = new Sprite(getTexture('action-automated'))
      this.automatedImage.anchor.set(0.5)
      this.automatedImage.y = -56
      this.backgroundImage.addChild(this.automatedImage)
    }

    // Destroy image
    else if (!this.automated && this.automatedImage) {
      this.backgroundImage.removeChild(this.automatedImage)
      this.automatedImage = null
    }
  }

  getAlpha() {
    if (this.status === 'PREVIEW') {
      return PREVIEW_ICON_ALPHA
    } else {
      return 1
    }
  }

  createBarImage() {
    const pixel = getPixelPosition(this.tile.axial)

    this.barImage = createImage('progress-bar', { axialZ: this.tile.axial.z })
    this.barImage.x = pixel.x
    this.barImage.y = pixel.y - this.getImageOffsetY() + BAR_OFFSET_Y

    this.barFillImageMask = new Sprite(Texture.WHITE)
    this.barFillImageMask.anchor.set(0, 0.5)
    this.barFillImageMask.y = 0
    this.barFillImageMask.x = -70
    this.barFillImageMask.tint = hex('#ff0000') // for easier debug
    this.barFillImageMask.height = 16
    this.barFillImageMask.width = 0

    this.barFillImage = new Sprite(getTexture('progress-bar-fill'))
    this.barFillImage.anchor.set(0.5, 0.5)
    this.barFillImage.mask = this.barFillImageMask

    this.barImage.addChild(this.barFillImage)
    this.barImage.addChild(this.barFillImageMask)
  }

  createFillImage() {
    this.fillImageMask = new Sprite(Texture.WHITE)
    this.fillImageMask.anchor.set(0.5, 1)
    this.fillImageMask.y = 50
    this.fillImageMask.tint = hex('#ff0000') // for easier debug
    this.fillImageMask.width = 100
    this.fillImageMask.height = 0

    this.fillImage = new Sprite(getTexture('action-fill'))
    this.fillImage.anchor.set(0.5, 0.5)
    this.fillImage.mask = this.fillImageMask

    this.backgroundImage.addChildAt(this.fillImage, 0)
    this.backgroundImage.addChild(this.fillImageMask)
  }

  createBuildingPreviewImage(
    type: 'BUILD_CAMP' | 'BUILD_TOWER' | 'BUILD_CASTLE'
  ) {
    let textureName = ''

    switch (type) {
      case 'BUILD_CAMP':
        textureName = 'camp-icon'
        break
      case 'BUILD_TOWER':
        textureName = 'tower-icon'
        break
      case 'BUILD_CASTLE':
        textureName = 'castle-icon'
        break
    }

    const animation = getImageAnimation(this.backgroundImage)
    let initialFraction: number | undefined = undefined
    if (animation) {
      initialFraction = 1 - animation.fraction
      animation.destroy()
    }

    const pixel = getPixelPosition(this.tile.axial)
    this.buildingPreviewImage = createImage(textureName)
    this.buildingPreviewImage.x = pixel.x
    this.buildingPreviewImage.y = pixel.y
    this.buildingPreviewImage.alpha = 0
    this.buildingPreviewImage.zIndex = getImageZIndex(
      'action-building-preview',
      {
        axialZ: this.tile.axial.z,
      }
    )

    new Animation(
      this.buildingPreviewImage,
      (image, fraction) => {
        image.alpha = fraction * BUILDING_PREVIEW_ALPHA
      },
      {
        initialFraction,
        speed: 0.1,
        ease: easeOutQuad,
      }
    )
  }

  getArmyModeOffsetY() {
    if (this.tile.building) {
      return ARMY_MODE_OFFSET_Y[this.tile.building.type]
    }

    return 0
  }

  toggleAutomated() {
    if (!store.socket) return

    this.setAutomated(!this.automated)

    if (this.automated) {
      store.socket.send('actionStartAutomation', `${this.tile.id}`)
    } else {
      store.socket.send('actionCancelAutomation', `${this.tile.id}`)
    }
  }

  activateArmyMode() {
    if (this.armyModeActive) return

    let initialFraction: number | undefined = undefined
    const animation = getImageAnimation(this.backgroundImage)
    if (animation) {
      initialFraction = 1 - animation.fraction
      animation.destroy()
    }

    new Animation(
      this.backgroundImage,
      (image, fraction, context) => {
        image.y = context.baseY - context.offsetY * fraction
        image.alpha = ARMY_MODE_ALPHA * fraction
      },
      {
        ease: easeOutCubic,
        initialFraction,
        speed: 0.05,
        context: { baseY: this.baseY, offsetY: this.getArmyModeOffsetY() },
      }
    )

    this.backgroundImage.zIndex -= 100

    if (this.barImage) {
      this.barImage.visible = false
    }

    this.armyModeActive = true
  }

  deactivateArmyMode() {
    if (!this.armyModeActive) return

    let initialFraction: number | undefined = undefined
    const animation = getImageAnimation(this.backgroundImage)
    if (animation) {
      initialFraction = 1 - animation.fraction
      animation.destroy()
    }

    new Animation(
      this.backgroundImage,
      (image, fraction, context) => {
        image.y = context.baseY - context.offsetY * (1 - fraction)
        image.alpha = 1 - ARMY_MODE_ALPHA + ARMY_MODE_ALPHA * fraction
      },
      {
        initialFraction,
        ease: easeOutCubic,
        speed: 0.05,
        context: { baseY: this.baseY, offsetY: this.getArmyModeOffsetY() },
      }
    )

    this.backgroundImage.zIndex += 100

    if (this.barImage && this.status === 'RUNNING') {
      this.barImage.visible = true
    }

    this.armyModeActive = false
    this.update()
  }

  isPreview(): boolean {
    return this.status === 'PREVIEW'
  }

  destroy() {
    if (!store.game) return

    const index = store.game.actions.indexOf(this)
    if (index !== -1) {
      store.game.actions.splice(index, 1)
    }

    this.tile.action = null

    if (
      this.status !== 'PREVIEW' &&
      this.type === 'RECRUIT_ARMY' &&
      this.owner.id === store.game.playerId
    ) {
      SoundManager.play('ARMY_CREATE')
    }

    const animation = getImageAnimation(this.backgroundImage)
    let initialFraction: number | undefined = undefined
    if (animation) {
      initialFraction = 1 - animation.fraction
      animation.destroy()
    }

    // Icon Image
    new Animation(
      this.backgroundImage,
      (image, fraction) => {
        image.alpha = (1 - fraction) * this.getAlpha()
      },
      {
        initialFraction,
        speed: DESTROY_ANIMATION_SPEED,
        onFinish: () => {
          if (!store.game || !store.game.pixi) return

          store.game.pixi.stage.removeChild(this.backgroundImage)
        },
      }
    )

    // Progress Bar
    if (this.barImage) {
      new Animation(
        this.barImage,
        (image, fraction) => {
          image.alpha = (1 - fraction) * this.getAlpha()
        },
        {
          initialFraction,
          speed: DESTROY_ANIMATION_SPEED,
          onFinish: () => {
            if (!store.game || !store.game.pixi || !this.barImage) return

            store.game.pixi.stage.removeChild(this.barImage)
          },
        }
      )
    }

    // Building Preview
    if (this.buildingPreviewImage) {
      new Animation(
        this.buildingPreviewImage,
        (image, fraction) => {
          image.alpha = (1 - fraction) * BUILDING_PREVIEW_ALPHA
        },
        {
          initialFraction,
          speed: DESTROY_ANIMATION_SPEED,
          onFinish: () => {
            if (!store.game || !store.game.pixi || !this.buildingPreviewImage) {
              return
            }

            store.game.pixi.stage.removeChild(this.buildingPreviewImage)
          },
        }
      )
    }
  }
}

export default Action
