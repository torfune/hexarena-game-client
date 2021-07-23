import getPixelPosition from '../functions/getPixelPosition'
import store from '../store'
import Tile from './Tile'
import Player from './Player'
import { Graphics, Sprite } from 'pixi.js'
import Animation from './Animation'
import { easeOutCubic, easeOutElastic, easeOutQuad } from '../functions/easing'
import SoundManager from '../../services/SoundManager'
import createImage from '../functions/createImage'
import getImageAnimation from '../functions/getImageAnimation'
import getTexture from '../functions/getTexture'
import hex from '../functions/hex'
import {
  ACTION_BAR_FILL_OFFSET_Y,
  ACTION_BAR_FILL_WIDTH,
  ACTION_BAR_OFFSET_Y,
  ACTION_FILL_OFFSET_Y,
  ACTION_OFFSET_Y,
  BUILDING_OFFSET_Y,
} from '../../constants/constants-game'

const BAR_MASK_WIDTH = 140
const FILL_MASK_HEIGHT = 100
const BACKGROUND_MASK_HEIGHT = 170
const BACKGROUND_MASK_HEIGHT_ARMY_MODE = 127
const BUILDING_PREVIEW_ALPHA = 0.25
const PREVIEW_ICON_ALPHA = 0.5
const DESTROY_ANIMATION_SPEED = 0.08
const ARMY_MODE_ALPHA = 0.75
const ARMY_MODE_OFFSET_Y = {
  CAMP: 93,
  TOWER: 116,
  CASTLE: 116,
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
  backgroundImageMask: Graphics = new Graphics()
  fillImage: Sprite = new Sprite()
  fillImageMask: Graphics = new Graphics()
  iconImage: Sprite = new Sprite()
  barImage: Sprite | null = null
  barFillImage: Sprite | null = null
  barFillImageMask: Graphics | null = null
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
      group: 'actions',
    })
    this.backgroundImage.x = pixel.x
    this.backgroundImage.y = this.baseY
    this.backgroundImage.alpha = 0

    this.backgroundImageMask = new Graphics()
    this.backgroundImageMask.x = -70
    this.backgroundImageMask.y = -BACKGROUND_MASK_HEIGHT
    this.backgroundImageMask.beginFill(hex('#ff0000'))
    this.backgroundImageMask.drawRect(0, 0, 140, BACKGROUND_MASK_HEIGHT)
    this.backgroundImage.mask = this.backgroundImageMask

    const textureName =
      this.status === 'PAUSED' || this.status === 'QUEUED'
        ? 'action-icon-pause'
        : this.getTextureName()
    this.iconImage = new Sprite(getTexture(textureName))
    this.iconImage.alpha = 1
    this.iconImage.anchor.set(0.5, 0.5)
    this.iconImage.y = -68
    ;(this.iconImage as any).parentGroup = store.game?.actionsGroup

    this.backgroundImage.addChild(this.iconImage)
    this.backgroundImage.addChild(this.backgroundImageMask)

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
        speed: 0.02,
        ease: easeOutElastic(0.5),
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

    this.barFillImageMask.clear()
    this.barFillImageMask.beginFill(hex('#ff0000'))
    this.barFillImageMask.drawRect(0, 0, fraction * BAR_MASK_WIDTH, 16)

    const height = fraction * FILL_MASK_HEIGHT
    this.fillImageMask.clear()
    this.fillImageMask.beginFill(hex('#ff0000'))
    this.fillImageMask.drawRect(0, FILL_MASK_HEIGHT - height, 100, height)
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
          return ACTION_OFFSET_Y.CAPITAL
        } else {
          return ACTION_OFFSET_Y.CASTLE
        }
      case 'BUILD_CAMP':
        return ACTION_OFFSET_Y.CAMP
      case 'BUILD_TOWER':
        return ACTION_OFFSET_Y.TOWER
      case 'BUILD_CASTLE':
        return ACTION_OFFSET_Y.CASTLE
      case 'REBUILD_VILLAGE':
        return ACTION_OFFSET_Y.VILLAGE
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

    if (this.tile.isHovered()) {
      this.startHover()
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
    if (this.automated) {
      if (!this.automatedImage) {
        this.createAutomatedImage('action-automated')
      } else {
        this.automatedImage.texture = getTexture('action-automated')
      }
    }

    // Destroy image
    else if (!this.automated && this.automatedImage) {
      this.backgroundImage.removeChild(this.automatedImage)
      this.automatedImage = null
    }

    // Hover
    if (this.tile.isHovered()) {
      this.startHover()
    }
  }

  startHover() {
    const shiftDown = !!store.game?.keyDown['Shift']

    if (this.type === 'RECRUIT_ARMY' && this.status !== 'PREVIEW') {
      if (!this.tile.building?.army || shiftDown) {
        // Cancel
        if (this.automated && this.automatedImage) {
          this.automatedImage.texture = getTexture('action-automated-cancel')
        }

        // Preview
        else if (!this.automated && !this.automatedImage) {
          this.createAutomatedImage('action-automated-preview')
        }
      }
    }
  }

  endHover() {
    if (this.type === 'RECRUIT_ARMY') {
      // Cancel
      if (this.automated && this.automatedImage) {
        this.automatedImage.texture = getTexture('action-automated')
      }

      // Preview
      else if (!this.automated && this.automatedImage) {
        this.backgroundImage.removeChild(this.automatedImage)
        this.automatedImage = null
      }
    }
  }

  createAutomatedImage(textureName: string) {
    if (this.automatedImage) return

    this.automatedImage = new Sprite(getTexture(textureName))
    this.automatedImage.anchor.set(0.5, 1)
    this.automatedImage.y = -101
    this.backgroundImage.addChild(this.automatedImage)
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

    this.barImage = createImage('progress-bar', { group: 'actions' })
    this.barImage.x = pixel.x
    this.barImage.y = pixel.y - this.getImageOffsetY() - ACTION_BAR_OFFSET_Y

    this.barFillImageMask = new Graphics()
    this.barFillImageMask.y = -ACTION_BAR_FILL_OFFSET_Y - 8
    this.barFillImageMask.x = -ACTION_BAR_FILL_WIDTH / 2

    this.barFillImage = new Sprite(getTexture('progress-bar-fill'))
    this.barFillImage.anchor.set(0.5, 0.5)
    this.barFillImage.y = -ACTION_BAR_FILL_OFFSET_Y
    this.barFillImage.mask = this.barFillImageMask

    this.barImage.addChild(this.barFillImage)
    this.barImage.addChild(this.barFillImageMask)
  }

  createFillImage() {
    this.fillImageMask = new Graphics()
    this.fillImageMask.x = -50
    this.fillImageMask.y = -ACTION_FILL_OFFSET_Y - FILL_MASK_HEIGHT

    this.fillImage = new Sprite(getTexture('action-fill'))
    this.fillImage.anchor.set(0.5, 1)
    this.fillImage.y = -ACTION_FILL_OFFSET_Y
    this.fillImage.mask = this.fillImageMask

    this.backgroundImage.addChildAt(this.fillImage, 0)
    this.backgroundImage.addChild(this.fillImageMask)
  }

  createBuildingPreviewImage(
    type: 'BUILD_CAMP' | 'BUILD_TOWER' | 'BUILD_CASTLE'
  ) {
    let textureName = ''
    let offsetY = 0

    switch (type) {
      case 'BUILD_CAMP':
        textureName = 'camp-icon'
        offsetY = BUILDING_OFFSET_Y.CAMP + 10
        break
      case 'BUILD_TOWER':
        textureName = 'tower-icon'
        offsetY = BUILDING_OFFSET_Y.TOWER + 10
        break
      case 'BUILD_CASTLE':
        textureName = 'castle-icon'
        offsetY = BUILDING_OFFSET_Y.CASTLE + 10
        break
    }

    const animation = getImageAnimation(this.backgroundImage)
    let initialFraction: number | undefined = undefined
    if (animation) {
      initialFraction = 1 - animation.fraction
      animation.destroy()
    }

    const pixel = getPixelPosition(this.tile.axial)
    this.buildingPreviewImage = createImage(textureName, { group: 'actions' })
    this.buildingPreviewImage.x = pixel.x
    this.buildingPreviewImage.y = pixel.y - offsetY
    this.buildingPreviewImage.alpha = 0

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

        const maskDelta =
          BACKGROUND_MASK_HEIGHT - BACKGROUND_MASK_HEIGHT_ARMY_MODE

        context.action.backgroundImageMask.clear()
        context.action.backgroundImageMask.beginFill(hex('#ff0000'))
        context.action.backgroundImageMask.drawRect(
          0,
          0,
          140,
          BACKGROUND_MASK_HEIGHT_ARMY_MODE + maskDelta * (1 - fraction)
        )
      },
      {
        ease: easeOutCubic,
        initialFraction,
        speed: 0.05,
        context: {
          baseY: this.baseY,
          offsetY: this.getArmyModeOffsetY(),
          action: this,
        },
      }
    )

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

    if (this.barImage && this.status === 'RUNNING') {
      this.barImage.visible = true
    }

    this.backgroundImageMask.clear()
    this.backgroundImageMask.beginFill(hex('#ff0000'))
    this.backgroundImageMask.drawRect(0, 0, 140, BACKGROUND_MASK_HEIGHT)

    this.armyModeActive = false
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
      this.status !== 'QUEUED' &&
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
