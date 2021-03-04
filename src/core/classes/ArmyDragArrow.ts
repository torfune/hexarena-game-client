import { Sprite } from 'pixi.js-legacy'
import createImage from '../functions/createImage'
import Tile from './Tile'
import getPixelPosition from '../functions/getPixelPosition'
import store from '../store'
import destroyImage from '../functions/destroyImage'

class ArmyDragArrow {
  tile: Tile
  body: Sprite = createImage('army-drag-arrow', 'army-drag-arrow-body')
  head: Sprite = createImage('army-drag-arrow', 'army-drag-arrow-head')

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

    const pixel = getPixelPosition(this.tile.axial)
    // pixel.y += 40

    const { cursor, camera, scale } = store.game

    if (!cursor || !camera) return

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

    let canSendArmy = false
    const { hoveredTile, selectedArmyTile } = store.game
    if (hoveredTile && selectedArmyTile) {
      let index = null
      for (let i = 0; i < 6; i++) {
        if (store.game.selectedArmyTargetTiles[i].includes(hoveredTile)) {
          index = i
          break
        }
      }

      if (index !== null) {
        canSendArmy = true
      }
    }

    if (canSendArmy) {
      this.body.alpha = 0.7
      this.head.alpha = 0.9
    } else {
      this.body.alpha = 0.2
      this.head.alpha = 0.4
    }
  }

  destroy() {
    if (!store.game) return

    destroyImage('army-drag-arrow', this.body)
    destroyImage('army-drag-arrow', this.head)

    if (store.game.armyDragArrow === this) {
      store.game.armyDragArrow = null
    }
  }
}

export default ArmyDragArrow
