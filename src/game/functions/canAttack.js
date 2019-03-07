import game from '../../game'

const canAttack = tile => {
  for (let i = 0; i < 6; i++) {
    const neighbor = tile.neighbors[i]

    if (
      neighbor &&
      neighbor.owner &&
      neighbor.owner.id === game.playerId &&
      !tile.owner &&
      !tile.isContested() &&
      !game.selectedArmyTile
    ) {
      return true
    }
  }
  return false
}

export default canAttack
