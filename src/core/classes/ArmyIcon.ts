import Tile from './Tile'
import { Sprite } from 'pixi.js'
import getPixelPosition from '../functions/getPixelPosition'
import store from '../store'
import {
  ARMY_ICON_OFFSET_Y,
  UNIT_MOVEMENT_SPEED,
} from '../../constants/constants-game'
import {
  easeInBack,
  easeInElastic,
  easeOutCubic,
  easeOutElastic,
} from '../functions/easing'
import { Pixel } from '../../types/coordinates'
import Animation from './Animation'
import createImage from '../functions/createImage'

class ArmyIcon {
  image: Sprite
  tile: Tile
  targetPosition: Pixel | null = null
  originalPosition: Pixel | null = null
  animationFraction: number | null = null

  constructor(tile: Tile) {
    this.tile = tile
    this.image = createImage('army-icon', { group: 'objects' })

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
      {
        speed: 0.02,
        ease: easeOutElastic(0.8),
      }
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
          image.scale.set(1 - fraction)
        },
        {
          speed: 0.025,
          ease: easeInBack,
          onFinish: (image) => {
            if (!store.game || !store.game.pixi) return

            store.game.pixi.stage.removeChild(image)
          },
        }
      )
    }, 200)
  }
}

export default ArmyIcon
