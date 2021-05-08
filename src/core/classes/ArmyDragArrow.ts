import { Sprite } from 'pixi.js'
import createImage from '../functions/createImage'
import Tile from './Tile'
import getPixelPosition from '../functions/getPixelPosition'
import store from '../store'
import destroyImage from '../functions/destroyImage'
import { TILE_RADIUS } from '../../constants/constants-game'

class ArmyDragArrow {
  tile: Tile
  body: Sprite = createImage('army-drag-arrow-body', { group: 'dragArrows' })
  head: Sprite = createImage('army-drag-arrow-head', { group: 'dragArrows' })

  constructor(tile: Tile) {
    this.tile = tile

    this.body.anchor.set(0, 0.5)
    this.body.scale.y = 2.5
    this.head.anchor.set(0, 0.5)

    this.head.scale.set(2)

    this.update()
  }

  update() {
    if (!store.game) return

    const { cursor, camera, scale } = store.game
    if (!cursor || !camera) return

    const pixel = getPixelPosition(this.tile.axial)
    pixel.y -= TILE_RADIUS * 2

    const pixelCursor = {
      x: (cursor.x - camera.x) / scale,
      y: (cursor.y - camera.y) / scale,
    }
    const delta = {
      x: pixelCursor.x - pixel.x,
      y: pixelCursor.y - pixel.y,
    }

    const angle =
      Math.atan2(pixelCursor.x - pixel.x, -(pixelCursor.y - pixel.y)) -
      Math.PI / 2

    const arrowLength = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2))

    this.body.x = pixel.x
    this.body.y = pixel.y
    this.body.width = arrowLength
    this.body.rotation = angle

    this.head.x = pixel.x + delta.x
    this.head.y = pixel.y + delta.y
    this.head.rotation = angle
  }

  destroy() {
    if (!store.game) return

    destroyImage(this.body)
    destroyImage(this.head)
  }
}

export default ArmyDragArrow
