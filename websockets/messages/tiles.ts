import GameServerMessage from '../../types/GameServerMessage'

const tiles: GameServerMessage = {
  isArray: true,
  instance: true,
  type: {
    id: 'string',
    x: 'number',
    z: 'number',
    ownerId: 'string',
    camp: 'bool',
    base: 'bool',
    castle: 'bool',
    forest: 'bool',
    mountain: 'bool',
    village: 'bool',
    bedrock: 'bool',
    hitpoints: 'number',
  },
}

export default tiles
