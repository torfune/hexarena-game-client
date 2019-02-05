import game from '../../game'
import getAttackDuration from './getAttackDuration'

const getActionPreview = tile => {
  if (!tile) return null

  let isNeighborToPlayer = false

  for (let i = 0; i < 6; i++) {
    const neighbor = tile.neighbors[i]

    if (!neighbor) continue

    if (neighbor.owner && neighbor.owner.id === game.playerId) {
      isNeighborToPlayer = true
      break
    }
  }

  if (isNeighborToPlayer && !tile.owner) {
    let terrain = 'Plains'

    if (tile.mountain) {
      terrain = 'Mountains'
    } else if (tile.forest) {
      terrain = 'Forest'
    }

    const durationMs = getAttackDuration(game.playerId, tile)

    return {
      label: 'Attack',
      terrain,
      duration: `${durationMs / 1000}s`,
    }
  }
}

export default getActionPreview
