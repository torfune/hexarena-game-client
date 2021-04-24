import Tile from './Tile'
import { Sprite } from 'pixi.js-legacy'
import createImage from '../functions/createImage'
import getPixelPosition from '../functions/getPixelPosition'
import destroyImage from '../functions/destroyImage'
import store from '../store'
import Animation from './Animation'
import BuildingType from '../../types/BuildingType'
import { HP_BACKGROUND_OFFSET } from '../../constants/constants-game'
import getTexture from '../functions/getTexture'
import getImageAnimation from '../functions/getImageAnimation'
import Army from './Army'
import SoundManager from '../../services/SoundManager'

class Building {
  readonly id: string
  readonly tile: Tile
  hp: number
  type: BuildingType
  army: Army | null = null
  image: Sprite
  hpBarImage: Sprite | null = null
  hpBarVisible: boolean = false

  constructor(id: string, tile: Tile, type: BuildingType, hp: number) {
    this.id = id
    this.tile = tile
    this.type = type
    this.hp = hp
    this.image = createImage(this.getTextureName(), { axialZ: tile.axial.z })

    const pixel = getPixelPosition(tile.axial)
    this.image.x = pixel.x
    this.image.y = pixel.y
    this.image.scale.set(0)
    this.image.alpha = 0

    // HP Image
    if (this.type !== 'CAMP') {
      this.updateHpBar()
    }

    new Animation(
      this.image,
      (image, fraction) => {
        image.scale.set(fraction)
        image.alpha = fraction
      },
      { speed: 0.05 }
    )

    if (store.game) {
      store.game.buildings.set(id, this)
    }
  }

  setHp(newHp: number) {
    this.hp = newHp
    this.updateHpBar()
  }

  setType(newType: BuildingType) {
    this.type = newType
    this.image.texture = getTexture(this.getTextureName())
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
    } else {
      this.hpBarImage.texture = this.getHpBarTexture()
    }

    if (!this.hasFullHp()) {
      this.showHitpoints()
    }

    if (this.hasFullHp() && !this.tile.isHovered()) {
      setTimeout(() => {
        if (this.hasFullHp() && !this.tile.isHovered()) {
          this.hideHitpoints()
        }
      }, 500)
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
    if (
      newArmy &&
      this.tile.owner &&
      this.tile.owner?.id === store.game?.playerId
    ) {
      SoundManager.play('ARMY_ARRIVE')
    }

    this.army = newArmy
    this.hideHitpoints()
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
