import game from 'game'
import store from 'store'

const canAttack = tile => {
  for (let i = 0; i < 6; i++) {
    const neighbor = tile.neighbors[i]

    if (
      neighbor &&
      neighbor.owner &&
      neighbor.owner.id === store.player.id &&
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
