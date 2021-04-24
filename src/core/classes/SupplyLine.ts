import Tile from './Tile'
import store from '../store'

class SupplyLine {
  readonly id: string
  readonly sourceTile: Tile
  readonly targetTile: Tile
  confirmed: boolean = false

  constructor(id: string, sourceTile: Tile, targetTile: Tile) {
    this.id = id
    this.sourceTile = sourceTile
    this.targetTile = targetTile

    if (store.game) {
      store.game.supplyLines.set(this.id, this)
    }

    setTimeout(() => {
      if (!this.confirmed) {
        this.destroy()
      }
    }, 1000)
  }

  setConfirmed(newConfirmed: boolean) {
    this.confirmed = newConfirmed
  }

  destroy() {
    if (store.game) {
      store.game.supplyLines.delete(this.id)
    }
  }
}

export default SupplyLine
