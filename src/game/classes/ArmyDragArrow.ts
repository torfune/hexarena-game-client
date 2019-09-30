import { Sprite } from 'pixi.js'
import createImage from '../functions/createImage'
import Tile from './Tile'
import getPixelPosition from '../functions/pixelFromAxial'
import store from '../../store'
import destroyImage from '../functions/destroyImage'
import animate from '../functions/animate'

const SCALE = {
  BODY_X: 2,
  HEAD: 2,
}

class ArmyDragArrow {
  tile: Tile
  body: Sprite = createImage('armyDragArrow', 'army-drag-arrow-body')
  head: Sprite = createImage('armyDragArrow', 'army-drag-arrow-head')

  constructor(tile: Tile) {
    this.tile = tile

    this.body.anchor.set(0.5, 1)
    this.body.scale.x = SCALE.BODY_X
    this.head.anchor.set(0.5, 1)
    this.head.scale.set(SCALE.HEAD)

    this.update()
  }

  update() {
    if (!store.game) return

    const pixel = getPixelPosition(this.tile.axial)

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

    const angle = Math.atan2(
      pixelCursor.x - pixel.x,
      -(pixelCursor.y - pixel.y)
    )
    const arrowLength = Math.sqrt(Math.pow(delta.x, 2) + Math.pow(delta.y, 2))

    this.body.x = pixel.x
    this.body.y = pixel.y
    this.body.height = arrowLength + 30
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
      this.body.alpha = 0.6
      this.head.alpha = 1
    } else {
      this.body.alpha = 0.2
      this.head.alpha = 1
    }
  }

  destroy(doAnimate: boolean = true) {
    if (!store.game) return

    if (store.game.armyDragArrow === this) {
      store.game.armyDragArrow = null
    }

    if (!doAnimate) {
      destroyImage('armyDragArrow', this.body)
      destroyImage('armyDragArrow', this.head)
      return
    }

    const bodyHeight = this.body.height

    animate({
      image: this.body,
      duration: 200,
      onUpdate: (image, fraction) => {
        image.alpha = 0.6 * (1 - fraction)
        image.scale.x = SCALE.BODY_X * (1 - fraction)
        image.height = bodyHeight * (1 - fraction)
      },
      onFinish: image => {
        destroyImage('armyDragArrow', image)
      },
    })
    animate({
      image: this.head,
      duration: 200,
      onUpdate: (image, fraction) => {
        image.alpha = 1 - fraction
        image.scale.set(SCALE.HEAD + 1 * fraction)
      },
      onFinish: image => {
        destroyImage('armyDragArrow', image)
      },
    })
  }
}

export default ArmyDragArrow
