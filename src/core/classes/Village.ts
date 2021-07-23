import Tile from './Tile'
import { Graphics, Sprite } from 'pixi.js'
import createImage from '../functions/createImage'
import getPixelPosition from '../functions/getPixelPosition'
import destroyImage from '../functions/destroyImage'
import store from '../store'
import Animation from './Animation'
import getUniqueRandomizedPositions from '../functions/getUniqueRandomizedPositions'
import { Pixel } from '../../types/coordinates'
import getImageAnimation from '../functions/getImageAnimation'
import getTexture from '../functions/getTexture'
import {
  VILLAGE_BAR_FILL_OFFSET_Y,
  VILLAGE_BAR_FILL_WIDTH,
  VILLAGE_BAR_OFFSET_Y,
  VILLAGE_OFFSET_Y,
} from '../../constants/constants-game'
import hex from '../functions/hex'

const HOUSE_MARGIN_Y = 35
const HOUSE_RADIUS = 25
const HOUSE_OFFSET = 75

class Village {
  readonly id: string
  readonly tile: Tile
  level: number = 0
  houses: Sprite[] = []
  housesPositions: Pixel[] = []
  barImage: Sprite | null = null
  barFillImage: Sprite | null = null
  barFillMask: Graphics | null = null
  barTargetY: number = 0
  barPreviousY: number = 0
  yieldDuration: number | null = null
  yieldAt: number | null = null
  raided: boolean

  constructor(id: string, tile: Tile, raided: boolean) {
    this.id = id
    this.tile = tile
    this.raided = raided

    const pixel = getPixelPosition(tile.axial)
    this.housesPositions = getUniqueRandomizedPositions(
      6,
      HOUSE_RADIUS,
      pixel,
      HOUSE_OFFSET
    )

    tile.village = this
  }

  setLevel(newLevel: number) {
    if (newLevel < this.level) {
      console.warn('WARNING: village level cannot be decreased')
      return
    }

    const newHousesCount = newLevel - this.level

    for (let i = 0; i < newHousesCount; i++) {
      const housePosition = this.housesPositions[this.houses.length]

      const image = createImage(this.raided ? 'house-ruins' : 'house', {
        group: 'objects',
      })
      image.x = housePosition.x
      image.y = housePosition.y + HOUSE_MARGIN_Y - VILLAGE_OFFSET_Y
      image.anchor.set(0.5, 1)

      const scale = 1
      image.scale.x = 0
      image.scale.y = 0
      new Animation(
        image,
        (image, fraction) => {
          image.scale.set(scale * fraction)
        },
        { speed: 0.04 }
      )

      this.houses.push(image)
    }

    this.animateBarY()
    this.level = newLevel
  }

  setYieldAt(newYieldAt: number | null) {
    if (!this.barImage && newYieldAt) {
      const pixel = getPixelPosition(this.tile.axial)

      this.barImage = createImage('village-bar', { group: 'objects' })
      this.barImage.x = pixel.x
      this.barImage.y = this.getBarY()

      this.barFillMask = new Graphics()
      this.barFillMask.y = -VILLAGE_BAR_FILL_OFFSET_Y - 8
      this.barFillMask.x = -VILLAGE_BAR_FILL_WIDTH / 2

      this.barFillImage = new Sprite(getTexture('village-bar-fill'))
      this.barFillImage.anchor.set(0.5, 0.5)
      this.barFillImage.mask = this.barFillMask
      this.barFillImage.y = -VILLAGE_BAR_FILL_OFFSET_Y

      this.barImage.addChild(this.barFillImage)
      this.barImage.addChild(this.barFillMask)

      this.animateBarY()
      this.updateBarFill()
    } else if (this.barImage && !newYieldAt) {
      destroyImage(this.barImage)
      this.barImage = null
    }

    this.yieldAt = newYieldAt
  }

  setYieldDuration(newYieldDuration: number | null) {
    this.yieldDuration = newYieldDuration
  }

  setRaided(newRaided: boolean) {
    for (let i = 0; i < this.houses.length; i++) {
      const house = this.houses[i]
      house.texture = getTexture(newRaided ? 'house-ruins' : 'house')
    }

    this.raided = newRaided
  }

  updateBarFill() {
    if (!this.barFillImage || !this.barFillMask) {
      return
    }

    if (!this.yieldAt || !this.yieldDuration) {
      return
    }

    const { yieldAt, yieldDuration } = this
    const timeDelta = yieldAt + store.game!.ping! - Date.now()
    let fraction = Math.round((1 - timeDelta / yieldDuration) * 100) / 100

    if (fraction > 1) {
      fraction = 1
    }

    if (fraction < 0) {
      fraction = 0
    }

    this.barFillMask.clear()
    this.barFillMask.beginFill(hex('#ff0000'))
    this.barFillMask.drawRect(0, 0, fraction * VILLAGE_BAR_FILL_WIDTH, 16)
  }

  animateBarY() {
    if (!this.barImage) return

    this.barPreviousY = this.barTargetY
    this.barTargetY = this.getBarY()
    if (!this.barPreviousY) {
      this.barPreviousY = this.barTargetY
    }

    let initialFraction: number | undefined = undefined

    const animation = getImageAnimation(this.barImage)
    if (animation) {
      initialFraction = 1 - animation.fraction
      animation.destroy()
    }

    const deltaY = this.barTargetY - this.barPreviousY

    new Animation(
      this.barImage,
      (image, fraction) => {
        image.y = this.barPreviousY + deltaY * fraction
      },
      { speed: 0.05, initialFraction }
    )
  }

  getBarY() {
    let highestHouseY = this.housesPositions[0].y
    for (let i = 0; i < this.houses.length; i++) {
      const housePosition = this.housesPositions[i]
      highestHouseY = Math.min(highestHouseY, housePosition.y)
    }

    return highestHouseY - VILLAGE_BAR_OFFSET_Y
  }

  destroy() {
    if (!store.game) return

    store.game.villages.delete(this.id)
    this.tile.village = null
    for (let i = 0; i < this.houses.length; i++) {
      destroyImage(this.houses[i])
    }
  }
}

export default Village
