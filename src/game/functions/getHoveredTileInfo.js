import game from '..'
import getAttackDuration from './getAttackDuration'

const getHoveredTileInfo = tile => {
  const { BUILD_COST, RECRUIT_COST } = window.gsConfig

  if (!tile) return null

  let isNeighborToPlayer = false
  let isOwnedByPlayer = tile.owner && tile.owner.id === game.playerId

  for (let i = 0; i < 6; i++) {
    const neighbor = tile.neighbors[i]

    if (!neighbor) continue

    if (neighbor.owner && neighbor.owner.id === game.playerId) {
      isNeighborToPlayer = true
      break
    }
  }

  const structure = tile.getStructureName()

  // Attack
  if (isNeighborToPlayer && !tile.owner && !tile.isContested()) {
    const durationMs = getAttackDuration(game.playerId, tile)

    return {
      label: 'Attack',
      structure,
      duration: `${durationMs / 1000}s`,
    }
  }

  // Build
  if (isOwnedByPlayer && tile.isEmpty()) {
    return {
      label: 'Fortify',
      structure,
      duration: `${window.gsConfig.BUILD_DURATION / 1000}s`,
      notEnoughWood: game.wood < BUILD_COST,
      woodCost: BUILD_COST,
    }
  }

  // Harvest
  if (isOwnedByPlayer && tile.forest) {
    return {
      label: 'Harvest',
      structure,
      duration: `${window.gsConfig.CUT_DURATION / 1000}s`,
    }
  }

  // Recruit
  if (isOwnedByPlayer && (tile.castle || tile.capital) && !tile.army) {
    return {
      label: 'Recruit',
      structure,
      duration: `${window.gsConfig.RECRUIT_DURATION / 1000}s`,
      notEnoughWood: game.wood < RECRUIT_COST,
      woodCost: RECRUIT_COST,
    }
  }

  // Structure
  if (!isNeighborToPlayer || isOwnedByPlayer) {
    if (
      structure !== 'Plains' &&
      structure !== 'Castle' &&
      structure !== 'Capital'
    ) {
      return {
        structure,
      }
    }
  }
}

export default getHoveredTileInfo
