import Tile from './Tile'
import { Sprite } from 'pixi.js'
import getPixelPosition from '../functions/getPixelPosition'
import store from '../store'
import {
  ARMY_ICON_OFFSET_Y,
  UNIT_MOVEMENT_SPEED,
} from '../../constants/constants-game'
import {
  easeInOutQuad,
  easeInOutQuart,
  easeInOutQuint,
  easeOutCubic,
} from '../functions/easing'
import { Pixel } from '../../types/coordinates'
import Animation from './Animation'
import createImage from '../functions/createImage'
import getImageZIndex from '../functions/getImageZIndex'

class ArmyIcon {
  image: Sprite
  tile: Tile
  targetPosition: Pixel | null = null
  originalPosition: Pixel | null = null
  animationFraction: number | null = null
  zIndexSwapped: boolean = false

  constructor(tile: Tile) {
    this.tile = tile
    this.image = createImage('army-icon', { axialZ: tile.axial.z })

    const pixel = getPixelPosition(tile.axial)
    this.image.x = pixel.x
    this.image.y = pixel.y - this.getOffsetY(tile)
    this.image.scale.set(0)
    this.image.alpha = 0

    new Animation(
      this.image,
      (image, fraction) => {
        image.scale.set(fraction)
        image.alpha = fraction
      },
      { speed: 0.05 }
    )

    if (store.game && store.game.pixi) {
      store.game.pixi.stage.addChild(this.image)
    }
  }

  update() {
    if (
      !this.originalPosition ||
      !this.targetPosition ||
      this.animationFraction === null
    ) {
      return
    }

    this.animationFraction += UNIT_MOVEMENT_SPEED
    if (this.animationFraction > 1) {
      this.animationFraction = 1
    }

    const easedFraction = easeOutCubic(this.animationFraction)
    const delta = {
      x: this.targetPosition.x - this.originalPosition.x,
      y: this.targetPosition.y - this.originalPosition.y,
    }

    this.image.x = this.originalPosition.x + delta.x * easedFraction
    this.image.y = this.originalPosition.y + delta.y * easedFraction

    // Update image z-index
    if (this.animationFraction >= 0.5 && !this.zIndexSwapped) {
      this.image.zIndex = getImageZIndex('army-icon', {
        axialZ: this.tile.axial.z,
      })
      this.zIndexSwapped = true
    }

    if (this.animationFraction === 1) {
      this.animationFraction = null
    }
  }

  moveOn(tile: Tile) {
    const pixel = getPixelPosition(tile.axial)

    this.targetPosition = {
      x: pixel.x,
      y: pixel.y - this.getOffsetY(tile),
    }

    this.originalPosition = {
      x: this.image.x,
      y: this.image.y,
    }

    this.animationFraction = 0
    this.zIndexSwapped = false
    this.tile = tile
  }

  getOffsetY(tile: Tile) {
    if (tile.building) {
      return ARMY_ICON_OFFSET_Y[tile.building.type]
    }

    return ARMY_ICON_OFFSET_Y.DEFAULT
  }

  destroy() {
    setTimeout(() => {
      new Animation(
        this.image,
        (image, fraction) => {
          image.alpha = 1 - fraction
        },
        {
          speed: 0.05,
          onFinish: (image) => {
            if (!store.game || !store.game.pixi) return

            store.game.pixi.stage.removeChild(image)
          },
        }
      )
    }, 500)
  }
}

export default ArmyIcon
