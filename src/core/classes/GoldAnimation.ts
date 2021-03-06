import createImage from '../functions/createImage'
import getPixelPosition from '../functions/getPixelPosition'
import Tile from './Tile'
import { Sprite } from 'pixi.js'
import store from '../store'
import SoundManager from '../../services/SoundManager'
import {
  GOLD_ANIMATION_OFFSET_Y,
  TILE_RADIUS,
} from '../../constants/constants-game'

const SCALE = 0.2
const SPEED = 0.6
const OFFSET_X = 48
const OFFSET_Y = 48
const MIN_Y = 20

class GoldAnimation {
  coins: Coin[] = []
  finished: boolean = false

  constructor(tile: Tile, count: number) {
    for (let i = 0; i < count; i++) {
      let offsetY = Math.round(Math.random() * OFFSET_Y)
      let offsetX = Math.round(Math.random() * OFFSET_X)

      offsetY = Math.random() > 0.5 ? offsetY : offsetY * -1

      if (count === 1) {
        offsetX = Math.random() > 0.5 ? offsetX : offsetX * -1
      } else {
        offsetX = i % 2 === 0 ? offsetX : offsetX * -1
        if (offsetX < 0 && offsetX > -16) {
          offsetX -= 16
        } else if (offsetX > 0 && offsetX < 16) {
          offsetX += 16
        }
      }

      this.coins.push(new Coin(tile, offsetX, offsetY + MIN_Y))
    }

    this.updateScale()

    if (store.game) {
      store.game.animations.push(this)
    }

    SoundManager.play('VILLAGE_DESTROY')
  }
  update() {
    for (let i = this.coins.length - 1; i >= 0; i--) {
      this.coins[i].update()

      if (this.coins[i].destroyed) {
        this.coins.splice(i, 1)
      }
    }

    if (this.coins.length === 0) {
      this.finished = true
    }
  }
  updateScale() {
    for (let i = 0; i < this.coins.length; i++) {
      this.coins[i].updateScale()
    }
  }
}

class Coin {
  baseOffsetY: number = 0
  speed: number = 0
  image: Sprite
  destroyed: boolean = false

  constructor(
    readonly tile: Tile,
    readonly offsetX: number,
    private offsetY: number
  ) {
    this.baseOffsetY = offsetY
    this.speed = SPEED + Math.random() * SPEED
    this.image = createImage('gold', { group: 'objects' })
    this.destroyed = false
  }
  update() {
    this.offsetY += this.speed
    this.updatePosition()

    if (this.offsetY - this.baseOffsetY > 32) {
      this.image.alpha -= 0.04

      if (this.image.alpha < 0) {
        this.image.alpha = 0
        this.destroy()
      }
    }
  }
  updateScale() {
    this.updatePosition()

    this.image.scale.x = SCALE
    this.image.scale.y = SCALE
  }
  updatePosition() {
    const pixel = getPixelPosition(this.tile.axial)

    this.image.x = pixel.x + this.offsetX
    this.image.y = pixel.y - this.offsetY - GOLD_ANIMATION_OFFSET_Y
  }
  destroy() {
    if (!store.game) return

    this.destroyed = true

    if (store.game.pixi) {
      store.game.pixi.stage.removeChild(this.image)
    }
  }
}

export default GoldAnimation
