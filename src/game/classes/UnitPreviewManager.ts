import Tile from './Tile'
import { Sprite } from 'pixi.js'
import Army from './Army'

class UnitPreviewManager {
  static army: Army | null = null
  static direction: number | null = null
  static previewTiles: PreviewTile[] = []

  static setArmy(army: Army) {
    this.army = army
  }

  static setDirection(direction: number | null) {
    this.direction = direction
    this.previewTiles = []

    console.log(this.previewTiles)

    if (!this.army || direction === null) return

    let steps = this.army.unitCount

    const firstTile = this.army.tile.neighbors[direction]
    if (firstTile) {
      const { mountain, bedrock, ownerId } = firstTile
      const unitCost = firstTile.unitCost(this.army.ownerId)
      const cantCapture =
        (mountain && ownerId && ownerId !== this.army.ownerId) || bedrock

      this.previewTiles.push({
        tile: firstTile,
        sprite: new Sprite(),
        unitCost,
        unitCount: steps,
        cantCapture,
      })
      steps -= unitCost
    } else {
      console.log(this.previewTiles)
      return
    }

    while (steps > 0) {
      const lastPreviewTile = this.previewTiles[this.previewTiles.length - 1]
      const tile = lastPreviewTile.tile.neighbors[direction]

      if (!tile) break

      const { mountain, bedrock, ownerId } = tile
      const unitCost = tile.unitCost(this.army.ownerId)
      const cantCapture =
        (mountain && ownerId && ownerId !== this.army.ownerId) || bedrock

      this.previewTiles.push({
        tile,
        sprite: new Sprite(),
        unitCost,
        unitCount: steps,
        cantCapture,
      })
      steps -= unitCost
    }

    console.log(this.previewTiles)
  }
}

interface PreviewTile {
  tile: Tile
  sprite: Sprite
  unitCost: number
  unitCount: number
  cantCapture: boolean
}

export default UnitPreviewManager
