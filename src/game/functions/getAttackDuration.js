import {
  DEFAULT_ATTACK_POWER,
  DEFAULT_DEFEND_POWER,
  FOREST_POWER,
  MOUNTAIN_POWER,
  MS_PER_POWER,
  POWER_PER_NEIGHBOR,
} from '../../constants'

// DONT CHANGE THIS WITHOUT CHANGING ON GAMESERVER TOO!
const getAttackDuration = (playerId, tile) => {
  let defendPower = DEFAULT_DEFEND_POWER
  let attackPower = DEFAULT_ATTACK_POWER

  for (let i = 0; i < 6; i++) {
    const neighbor = tile.neighbors[i]

    if (neighbor && neighbor.owner && neighbor.owner.id === playerId) {
      attackPower += POWER_PER_NEIGHBOR
    }
  }

  if (tile.mountain) {
    defendPower += MOUNTAIN_POWER
  }

  if (tile.forest) {
    defendPower += FOREST_POWER
  }

  return (defendPower - attackPower) * MS_PER_POWER
}

export default getAttackDuration
