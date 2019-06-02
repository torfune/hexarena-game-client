import store from '../../store'
import game from '..'
import Tile from '../classes/Tile'

const canAttack = (tile: Tile) => {
  for (let i = 0; i < 6; i++) {
    const neighbor = tile.neighbors[i]

    if (
      neighbor &&
      neighbor.owner &&
      neighbor.owner.id === store.playerId &&
      !tile.owner &&
      !tile.isContested() &&
      !tile.bedrock &&
      !game.selectedArmyTile
    ) {
      return true
    }
  }
  return false
}

export default canAttack
