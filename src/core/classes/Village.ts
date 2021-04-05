import Tile from './Tile'
import { Sprite } from 'pixi.js-legacy'
import createImage from '../functions/createImage'
import getPixelPosition from '../functions/getPixelPosition'
import destroyImage from '../functions/destroyImage'
import store from '../store'
import Animation from './Animation'
import getUniqueRandomizedPositions from '../functions/getUniqueRandomizedPositions'
import { Pixel } from '../../types/coordinates'
import * as PIXI from 'pixi.js'
import hex from '../functions/hex'

const HOUSE_MARGIN_Y = 35
const HOUSE_RADIUS = 25
const HOUSE_OFFSET = 75
const BAR_MASK_WIDTH = 140
const BAR_OFFSET_Y = 120

class Village {
  readonly id: string
  readonly tile: Tile
  housesCount: number
  houses: Sprite[] = []
  housesPositions: Pixel[] = []
  barImage: Sprite | null = null
  barFillImage: Sprite | null = null
  barFillMask: Sprite | null = null
  yieldDuration: number | null = null
  yieldAt: number | null = null

  constructor(id: string, tile: Tile, housesCount: number) {
    this.id = id
    this.tile = tile
    this.housesCount = housesCount

    const pixel = getPixelPosition(tile.axial)
    this.housesPositions = getUniqueRandomizedPositions(
      6,
      HOUSE_RADIUS,
      pixel,
      HOUSE_OFFSET
    )

    this.addHouses(housesCount)
    tile.village = this
  }

  setHousesCount(newHousesCount: number) {
    if (newHousesCount === 0) {
      this.destroy()
    }

    this.addHouses(newHousesCount - this.housesCount, true)
  }

  setYieldAt(newYieldAt: number | null) {
    console.log(`newYieldAt: ${newYieldAt}`)

    if (!this.barImage && newYieldAt) {
      const pixel = getPixelPosition(this.tile.axial)

      this.barImage = createImage('village-bar', { axialZ: this.tile.axial.z })
      this.barFillImage = createImage('village-bar-fill')

      this.barImage.x = pixel.x
      this.barImage.y = pixel.y - BAR_OFFSET_Y
      this.barImage.scale.set(0)
      this.barImage.alpha = 0

      this.barFillMask = new PIXI.Sprite(PIXI.Texture.WHITE)
      this.barFillMask.anchor.set(0, 0.5)
      this.barFillMask.y = 0
      this.barFillMask.x = -70
      this.barFillMask.tint = hex('#ff0000') // for easier debug
      this.barFillMask.height = 16
      this.barFillMask.width = 0

      this.barFillImage.mask = this.barFillMask

      this.barImage.addChild(this.barFillImage)
      this.barImage.addChild(this.barFillMask)

      new Animation(
        this.barImage,
        (image, fraction) => {
          image.scale.set(fraction)
          image.alpha = fraction
        },
        { speed: 0.05 }
      )

      this.updateBar()
    } else if (this.barImage && !newYieldAt) {
      destroyImage('village-bar', this.barImage)
      this.barImage = null
    }

    this.yieldAt = newYieldAt
  }

  setYieldDuration(newYieldDuration: number | null) {
    this.yieldDuration = newYieldDuration
  }

  addHouses(count: number, animate: boolean = false) {
    const pixel = getPixelPosition(this.tile.axial)
    for (let i = 0; i < count; i++) {
      const housePosition = this.housesPositions[this.houses.length]
      const image = createImage('house')
      image.x = housePosition.x
      image.y = housePosition.y + HOUSE_MARGIN_Y
      image.anchor.set(0.5, 1)

      const zIndexOffset = housePosition.y - pixel.y + HOUSE_OFFSET
      image.zIndex += zIndexOffset

      const scale = 0.9
      if (animate) {
        image.scale.x = 0
        image.scale.y = 0
        new Animation(
          image,
          (image, fraction) => {
            image.scale.y = scale * fraction
            image.scale.x = scale * fraction
          },
          { speed: 0.04 }
        )
      } else {
        image.scale.set(scale)
      }

      this.houses.push(image)
    }
  }

  updateBar() {
    if (!this.barFillImage || !this.barFillMask) {
      return
    }

    if (!this.yieldAt || !this.yieldDuration) {
      // this.barFillMask.width = 0
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

    this.barFillMask.width = fraction * BAR_MASK_WIDTH
  }

  destroy() {
    if (!store.game) return

    store.game.villages.delete(this.id)
    this.tile.village = null
    for (let i = 0; i < this.houses.length; i++) {
      destroyImage('house', this.houses[i])
    }
  }
}

export default Village
