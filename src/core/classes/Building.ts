import Tile from './Tile'
import { Sprite, Texture } from 'pixi.js'
import createImage from '../functions/createImage'
import getPixelPosition from '../functions/getPixelPosition'
import destroyImage from '../functions/destroyImage'
import store from '../store'
import Animation from './Animation'
import BuildingType from '../../types/BuildingType'
import {
  BUILDING_OFFSET_Y,
  BUILDING_REPAIR_BAR_FILL_OFFSET_Y,
  BUILDING_REPAIR_BAR_FILL_WIDTH,
  HP_BACKGROUND_OFFSET,
  HP_BAR_HIDE_DELAY,
  VILLAGE_BAR_FILL_WIDTH,
} from '../../constants/constants-game'
import getTexture from '../functions/getTexture'
import getImageAnimation from '../functions/getImageAnimation'
import Army from './Army'
import SoundManager from '../../services/SoundManager'
import isSpectating from '../../utils/isSpectating'
import hex from '../functions/hex'
import ArmySendManager from './ArmySendManager'
import RoadManager from '../RoadManager'

class Building {
  readonly id: string
  readonly tile: Tile
  hp: number
  type: BuildingType
  army: Army | null = null
  image: Sprite
  hpBarImage: Sprite | null = null
  hpRepairBarFillImage: Sprite | null = null
  hpRepairBarFillMask: Sprite | null = null
  hpBarVisible: boolean = false
  repairTime = 0

  constructor(id: string, tile: Tile, type: BuildingType, hp: number) {
    this.id = id
    this.tile = tile
    this.tile.building = this
    this.type = type
    this.hp = hp

    const pixel = getPixelPosition(tile.axial)
    this.image = createImage(this.getTextureName(), { group: 'objects' })
    this.image.x = pixel.x
    this.image.y = pixel.y - BUILDING_OFFSET_Y[this.type]
    this.image.alpha = 0

    // HP image
    if (this.type !== 'CAMP') {
      this.updateHpBar()
    }

    // Camp sound
    else if (tile.isOwnedByThisPlayer() || isSpectating()) {
      SoundManager.play('CAMP_CREATE')
    }

    new Animation(
      this.image,
      (image, fraction) => {
        image.alpha = fraction
      },
      { speed: 0.05 }
    )

    if (store.game) {
      store.game.buildings.set(id, this)
    }

    // Update target Building for Supply Line
    // if (tile.isOwnedByThisPlayer()) {
    //   RoadManager.update()
    // }
  }

  setHp(newHp: number) {
    if (newHp < this.hp && this.tile.action && this.tile.action.isPreview()) {
      this.tile.action.destroy()
    }

    this.hp = newHp
    this.updateHpBar()

    if (this.hasFullHp() && this.tile.isHovered()) {
      this.tile.showActionPreviewIfPossible()
    }
  }

  setType(newType: BuildingType) {
    if (
      this.type &&
      (this.tile.owner?.id === store.game?.playerId || isSpectating())
    ) {
      if (newType === 'TOWER') {
        SoundManager.play('TOWER_CREATE')
      } else if (newType === 'CASTLE') {
        SoundManager.play('CASTLE_CREATE')
      }
    }

    this.type = newType
    this.image.texture = getTexture(this.getTextureName())

    const pixel = getPixelPosition(this.tile.axial)
    this.image.y = pixel.y - BUILDING_OFFSET_Y[this.type]

    if (this.army) {
      this.army.updateBarY()
    }
  }

  setRepairTime(newRepairTime: number) {
    this.repairTime = newRepairTime
  }

  getMaxHp() {
    if (!store.gsConfig) return

    const { HP } = store.gsConfig

    switch (this.type) {
      case 'CAPITAL':
        return HP.CAPITAL
      case 'CAMP':
        return HP.CAMP
      case 'TOWER':
        return HP.TOWER
      case 'CASTLE':
        return HP.CASTLE
    }
  }

  updateHpBar() {
    const { gsConfig } = store
    if (!gsConfig) return

    // Create Image
    if (!this.hpBarImage) {
      this.hpBarImage = new Sprite(this.getHpBarTexture())
      this.hpBarImage.anchor.set(0.5, 0)
      this.hpBarImage.y = -this.getHpBarOffset()
      this.hpBarImage.alpha = 0
      this.image.addChild(this.hpBarImage)

      this.hpRepairBarFillMask = new Sprite(Texture.WHITE)
      this.hpRepairBarFillMask.anchor.set(0, 0.5)
      this.hpRepairBarFillMask.y = BUILDING_REPAIR_BAR_FILL_OFFSET_Y
      this.hpRepairBarFillMask.x = -BUILDING_REPAIR_BAR_FILL_WIDTH / 2
      this.hpRepairBarFillMask.tint = hex('#ff0000') // for easier debug
      this.hpRepairBarFillMask.height = 16
      this.hpRepairBarFillMask.width = 0
      this.hpBarImage.addChild(this.hpRepairBarFillMask)

      this.hpRepairBarFillImage = new Sprite(getTexture('hp-bar-repair-fill'))
      this.hpRepairBarFillImage.anchor.set(0.5, 0.5)
      this.hpRepairBarFillImage.y = BUILDING_REPAIR_BAR_FILL_OFFSET_Y
      this.hpRepairBarFillImage.mask = this.hpRepairBarFillMask
      this.hpBarImage.addChild(this.hpRepairBarFillImage)
    } else {
      this.hpBarImage.texture = this.getHpBarTexture()
    }

    if (!this.hasFullHp()) {
      this.showHitpoints()
    }

    if (this.hasFullHp()) {
      setTimeout(() => {
        if (this.hasFullHp()) {
          this.hideHitpoints()
        }
      }, HP_BAR_HIDE_DELAY)
    }
  }

  showHitpoints() {
    if (this.hpBarVisible || !this.hpBarImage) return

    let initialFraction: number | undefined = undefined

    const animation = getImageAnimation(this.hpBarImage)
    if (animation) {
      initialFraction = 1 - animation.fraction
      animation.destroy()
    }

    new Animation(
      this.hpBarImage,
      (image, fraction) => {
        image.alpha = fraction
      },
      { initialFraction, speed: 0.2 }
    )

    this.hpBarVisible = true
  }

  hideHitpoints() {
    if (!this.hpBarVisible || !this.hpBarImage) return

    let initialFraction

    const animation = getImageAnimation(this.hpBarImage)
    if (animation) {
      initialFraction = 1 - animation.fraction
      animation.destroy()
    }

    new Animation(
      this.hpBarImage,
      (image, fraction) => {
        fraction = 1 - fraction
        image.alpha = fraction
      },
      { initialFraction, speed: 0.1 }
    )

    this.hpBarVisible = false
  }

  setArmy(newArmy: Army | null) {
    this.army = newArmy
    this.hideHitpoints()

    // Army arrived
    if (newArmy) {
      if (
        this.tile.owner &&
        (this.tile.owner?.id === store.game?.playerId || isSpectating())
      ) {
        SoundManager.play('ARMY_ARRIVE')
      }

      if (this.tile.action && this.tile.action.isPreview()) {
        this.tile.action.destroy()
      }

      if (this.tile.action) {
        this.tile.action.activateArmyMode()
      }
    }

    // Army left
    else {
      if (!this.tile.action && this.tile.isHovered()) {
        this.tile.showActionPreviewIfPossible()
      }

      if (this.tile.action) {
        this.tile.action.deactivateArmyMode()
      }
    }
  }

  getTextureName() {
    switch (this.type) {
      case 'CAPITAL':
        return 'capital'
      case 'CAMP':
        return 'camp'
      case 'TOWER':
        return 'tower'
      case 'CASTLE':
        return 'castle'
    }
  }

  hasFullHp() {
    return this.hp === this.getMaxHp()
  }

  getHpBarOffset() {
    if (this.type !== 'CAMP') {
      return HP_BACKGROUND_OFFSET[this.type]
    }

    throw Error('Cannot get HP image offset for CAMP.')
  }

  getHpBarTexture() {
    const maxHp = this.getMaxHp()
    const textureName = `hp-bar-${this.hp}-${maxHp}`
    return getTexture(textureName)
  }

  isCamp() {
    return this.type === 'CAMP'
  }

  updateHpRepairBarFill() {
    if (
      !this.hpRepairBarFillImage ||
      !this.hpRepairBarFillMask ||
      !this.repairTime
    ) {
      return
    }

    const timeDelta = this.repairTime + store.game!.ping! - Date.now()
    let fraction =
      Math.round(
        (1 - timeDelta / store.gsConfig!.REPAIR_BUILDING_DURATION) * 100
      ) / 100

    if (fraction > 1) {
      fraction = 1
    }

    if (fraction < 0) {
      fraction = 0
    }

    this.hpRepairBarFillMask.width = fraction * BUILDING_REPAIR_BAR_FILL_WIDTH
  }

  destroy() {
    if (!store.game) return

    store.game.buildings.delete(this.id)

    if (this.tile.building === this) {
      this.tile.building = null
    }

    destroyImage(this.image)
  }
}

export default Building
