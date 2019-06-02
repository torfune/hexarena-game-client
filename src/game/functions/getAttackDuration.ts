import store from '../../store'
import Tile from '../classes/Tile'

const getAttackDuration = (playerId: string, tile: Tile) => {
  if (!store.gsConfig) return 0

  const {
    DEFAULT_ATTACK_POWER,
    DEFAULT_DEFEND_POWER,
    MS_PER_POWER,
    POWER_PER_NEIGHBOR,
  } = store.gsConfig

  let defendPower = DEFAULT_DEFEND_POWER
  let attackPower = DEFAULT_ATTACK_POWER

  for (let i = 0; i < 6; i++) {
    const neighbor = tile.neighbors[i]

    if (neighbor && neighbor.owner && neighbor.owner.id === playerId) {
      attackPower += POWER_PER_NEIGHBOR
    }
  }

  return (defendPower - attackPower) * MS_PER_POWER
}

export default getAttackDuration
