import Tile from '../classes/Tile'
import store from '../../store'
import HoveredTileInfo from '../../types/HoveredTileInfo'

const getHoveredTileInfo = (tile: Tile): HoveredTileInfo | null => {
  if (!store.gsConfig || !store.playerId || !store.player) return null

  // GS Config
  const {
    BUILD_COST,
    RECRUIT_COST,
    UPGRADE_COST,
    ATTACK_DURATION,
    ATTACK_COST,
    BUILD_DURATION,
    UPGRADE_DURATION,
    RECRUIT_DURATION,
    HP,
  } = store.gsConfig

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

  // Bedrock
  if (tile.bedrock) {
    return {
      structure,
    }
  }

  // Army send
  if (
    store.game.selectedArmyTile ||
    (tile.army && tile.ownerId === store.playerId)
  ) {
    return {
      label: 'Send Army',
      iconSrc: '/static/icons/army.svg',
      structure,
    }
  }

  // Attack
  if (isNeighborToPlayer && !tile.owner && !tile.action) {
    return {
      label: 'Capture Tile',
      iconSrc: '/static/icons/swords.svg',
      structure,
      duration: `${ATTACK_DURATION / 1000}s`,
      notEnoughGold: store.player.gold < ATTACK_COST,
      goldCost: ATTACK_COST,
    }
  }

  // Build
  const tileGold = tile.forest ? tile.forest.trees.length : 0
  if (isOwnedByPlayer && (tile.isEmpty() || tile.forest) && !tile.action) {
    return {
      label: 'Build Tower',
      iconSrc: '/static/images/tower-icon.png',
      structure,
      duration: `${BUILD_DURATION / 1000}s`,
      notEnoughGold: store.player.gold < BUILD_COST - tileGold,
      goldCost: BUILD_COST - tileGold,
    }
  }

  // Heal
  if (
    isOwnedByPlayer &&
    tile.building &&
    !tile.army &&
    !tile.action &&
    tile.building.hp < HP[tile.building.type]
  ) {
    return {
      label: 'Repair Building',
      structure,
      duration: `${RECRUIT_DURATION / 1000}s`,
      notEnoughGold: store.player.gold < RECRUIT_COST,
      goldCost: RECRUIT_COST,
    }
  }

  // Upgrade
  if (
    isOwnedByPlayer &&
    tile.building &&
    tile.building.type === 'TOWER' &&
    !tile.action
  ) {
    return {
      label: 'Upgrade to Castle',
      iconSrc: '/static/images/castle-icon.png',
      structure,
      duration: `${UPGRADE_DURATION / 1000}s`,
      notEnoughGold: store.player.gold < UPGRADE_COST,
      goldCost: UPGRADE_COST,
    }
  }

  // Recruit
  if (
    isOwnedByPlayer &&
    tile.building &&
    tile.building.type !== 'TOWER' &&
    !tile.army &&
    !tile.action
  ) {
    return {
      label: 'Recruit Army',
      iconSrc: '/static/icons/army.svg',
      structure,
      duration: `${RECRUIT_DURATION / 1000}s`,
      notEnoughGold: store.player.gold < RECRUIT_COST,
      goldCost: RECRUIT_COST,
    }
  }

  // No Action available, show structure
  if (!isNeighborToPlayer || isOwnedByPlayer) {
    if (
      structure !== 'Plains' &&
      structure !== 'Base' &&
      structure !== 'Tower' &&
      structure !== 'Castle'
    ) {
      return {
        structure,
      }
    }
  }

  return null
}

export default getHoveredTileInfo
