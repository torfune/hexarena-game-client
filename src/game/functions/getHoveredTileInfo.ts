import Tile from '../classes/Tile'
import store from '../../store'
import game from '..'
import HoveredTileInfo from '../../types/HoveredTileInfo'

const getHoveredTileInfo = (tile: Tile): HoveredTileInfo | null => {
  if (!store.gsConfig || !store.playerId || !store.player) return null

  const { BUILD_COST, RECRUIT_COST } = store.gsConfig

  let isNeighborToPlayer = false
  let isOwnedByPlayer = tile.owner && tile.owner.id === store.playerId

  for (let i = 0; i < 6; i++) {
    const neighbor = tile.neighbors[i]

    if (!neighbor) continue

    if (neighbor.owner && neighbor.owner.id === store.playerId) {
      isNeighborToPlayer = true
      break
    }
  }

  const structure = tile.getStructureName()

  // Army send
  if (game.selectedArmyTile) {
    return {
      label: 'Send army',
      structure,
    }
  }

  // Cancel
  if (tile.action && tile.action.owner.id === store.playerId) {
    return {
      label: 'Cancel action',
      structure,
    }
  }

  // Attack
  if (isNeighborToPlayer && !tile.owner && !tile.isContested()) {
    return {
      label: 'Capture',
      structure,
      duration: `${store.gsConfig.ATTACK_DURATION / 1000}s`,
    }
  }

  // Build
  if (isOwnedByPlayer && tile.canBuildCastle()) {
    return {
      label: 'Build castle',
      structure,
      duration: `${store.gsConfig.BUILD_DURATION / 1000}s`,
      notEnoughGold: store.player.gold < BUILD_COST,
      goldCost: BUILD_COST,
    }
  }

  // Cut
  if (isOwnedByPlayer && tile.forest) {
    return {
      label: 'Get gold',
      structure,
      duration: `${store.gsConfig.CUT_DURATION / 1000}s`,
    }
  }

  // Recruit / Heal
  if (isOwnedByPlayer && (tile.castle || tile.base) && !tile.army) {
    if (tile.hitpoints && tile.hitpoints === 1) {
      return {
        label: 'Repair building',
        structure,
        duration: `${store.gsConfig.HEAL_DURATION / 1000}s`,
        notEnoughGold: store.player.gold < RECRUIT_COST,
        goldCost: RECRUIT_COST,
      }
    }

    return {
      label: 'Recruit army',
      structure,
      duration: `${store.gsConfig.RECRUIT_DURATION / 1000}s`,
      notEnoughGold: store.player.gold < RECRUIT_COST,
      goldCost: RECRUIT_COST,
    }
  }

  // No Action available, show structure
  if (!isNeighborToPlayer || isOwnedByPlayer) {
    if (
      structure !== 'Plains' &&
      structure !== 'Castle' &&
      structure !== 'Base'
    ) {
      return {
        structure,
      }
    }
  }

  return null
}

export default getHoveredTileInfo
