import Tile from './Tile'
import { Sprite } from 'pixi.js'
import getPixelPosition from '../functions/getPixelPosition'
import store from '../store'
import {
  ARMY_ICON_OFFSET_Y,
  UNIT_MOVEMENT_SPEED,
} from '../../constants/constants-game'
import { easeInBack, easeOutCubic, easeOutElastic } from '../functions/easing'
import { Pixel } from '../../types/coordinates'
import Animation from './Animation'
import createImage from '../functions/createImage'
import hex from '../functions/hex'
import Army from './Army'

const OFFSET_Y = 296 / 2

class ArmyIcon {
  image: Sprite
  army: Army
  // targetPosition: Pixel | null = null
  // originalPosition: Pixel | null = null
  // animationFraction: number | null = null

  constructor(tile: Tile, army: Army) {
    this.army = army
    this.image = createImage('army-icon', { group: 'objects' })
    // this.image = createImage('white-pixel', { group: 'objects' })

    const pixel = getPixelPosition(tile.axial)
    this.image.x = pixel.x
    this.image.y = pixel.y - this.getOffsetY(tile)
    // this.image.width = 10
    // this.image.height = 10
    // this.image.tint = hex('#ff0000')
    // this.image.anchor.set(0.5, 0.5)
    // this.image.scale.set(0)
    // this.image.alpha = 0

    // new Animation(
    //   this.image,
    //   (image, fraction) => {
    //     image.scale.set(fraction)
    //     image.alpha = fraction
    //   },
    //   {
    //     speed: 0.02,
    //     ease: easeOutElastic(0.8),
    //   }
    // )

    if (store.game && store.game.pixi) {
      store.game.pixi.stage.addChild(this.image)
    }
  }

  update(army: Army) {
    if (!store.gsConfig) return

    const { ARMY_SPEED } = store.gsConfig

    if (army.moveDirection === null || !army.moveStartTile) {
      const axial = army.tile?.axial || army.building?.tile.axial
      if (axial) {
        const pixel = getPixelPosition(axial)
        this.image.x = pixel.x
        this.image.y =
          pixel.y - this.getOffsetY(army.tile || army.building?.tile || null)
      }
      return
    }

    const HEX_SIZE = 256.0
    const HEX_CONSTANT = 1.0 + 1.0 / 6.0
    const PIXEL_DIRECTION = [
      { X: HEX_SIZE / 2.0, Y: -(HEX_SIZE / HEX_CONSTANT) },
      { X: HEX_SIZE, Y: 0 },
      { X: HEX_SIZE / 2.0, Y: HEX_SIZE / HEX_CONSTANT },
      { X: -(HEX_SIZE / 2.0), Y: HEX_SIZE / HEX_CONSTANT },
      { X: -HEX_SIZE, Y: 0 },
      { X: -(HEX_SIZE / 2.0), Y: -(HEX_SIZE / HEX_CONSTANT) },
    ]

    const startTileAxial = army.moveStartTile.axial
    const startTilePixel = getPixelPosition(startTileAxial)
    const deltaTime = (Date.now() - army.moveStartedAt) / 1000
    const directionPixel = PIXEL_DIRECTION[army.moveDirection]

    const currentTilePixel = {
      x: startTilePixel.x + directionPixel.X * (deltaTime * ARMY_SPEED),
      y: startTilePixel.y + directionPixel.Y * (deltaTime * ARMY_SPEED),
    }

    this.image.x = currentTilePixel.x
    this.image.y =
      currentTilePixel.y -
      this.getOffsetY(army.tile || army.building?.tile || null)
  }

  // moveOn(tile: Tile) {
  //   const pixel = getPixelPosition(tile.axial)
  //
  //   this.targetPosition = {
  //     x: pixel.x,
  //     y: pixel.y - this.getOffsetY(tile),
  //   }
  //
  //   this.originalPosition = {
  //     x: this.image.x,
  //     y: this.image.y,
  //   }
  //
  //   this.animationFraction = 0
  //   this.tile = tile
  // }

  getOffsetY(tile: Tile | null) {
    if (this.army.moveDirection !== null) {
      return ARMY_ICON_OFFSET_Y.DEFAULT
    }

    if (tile?.building) {
      return ARMY_ICON_OFFSET_Y[tile.building.type]
    }

    return ARMY_ICON_OFFSET_Y.DEFAULT

    // OFFSET_Y
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
