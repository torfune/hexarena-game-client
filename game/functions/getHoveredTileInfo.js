import store from 'store'
import game from 'game'
import getAttackDuration from './getAttackDuration'

const getHoveredTileInfo = tile => {
  const { BUILD_COST, RECRUIT_COST } = store.config

  if (!tile) return null

  let isNeighborToPlayer = false
  let isOwnedByPlayer = tile.owner && tile.owner.id === store.player.id

  for (let i = 0; i < 6; i++) {
    const neighbor = tile.neighbors[i]

    if (!neighbor) continue

    if (neighbor.owner && neighbor.owner.id === store.player.id) {
      isNeighborToPlayer = true
      break
    }
  }

  const structure = tile.getStructureName()

  // Army send
  if (game.selectedArmyTile) {
    console.log('Army send..')
    return {
      label: 'Send army',
      structure,
    }
  }

  // Cancel
  if (tile.action && tile.action.owner.id === store.player.id) {
    return {
      label: 'Cancel action',
      structure,
    }
  }

  // Attack
  if (isNeighborToPlayer && !tile.owner && !tile.isContested()) {
    const durationMs = getAttackDuration(store.player.id, tile)

    return {
      label: 'Capture',
      structure,
      duration: `${durationMs / 1000}s`,
    }
  }

  // Build
  if (isOwnedByPlayer && tile.isEmpty()) {
    return {
      label: 'Build castle',
      structure,
      duration: `${store.config.BUILD_DURATION / 1000}s`,
      notEnoughGold: store.gold < BUILD_COST,
      goldCost: BUILD_COST,
    }
  }

  // Cut
  if (isOwnedByPlayer && tile.forest) {
    return {
      label: 'Get gold',
      structure,
      duration: `${store.config.CUT_DURATION / 1000}s`,
    }
  }

  // Recruit
  if (isOwnedByPlayer && (tile.castle || tile.capital) && !tile.army) {
    return {
      label: 'Recruit army',
      structure,
      duration: `${store.config.RECRUIT_DURATION / 1000}s`,
      notEnoughGold: store.gold < RECRUIT_COST,
      goldCost: RECRUIT_COST,
    }
  }

  // No Action available
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
