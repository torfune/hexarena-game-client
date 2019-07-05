import GameServerMessage from '../../types/GameServerMessage'

const tiles: GameServerMessage = {
  isArray: true,
  instance: true,
  type: {
    id: 'string',
    x: 'number',
    z: 'number',
    ownerId: 'string',
    buildingType: 'string',
    buildingHp: 'number',
    mountain: 'bool',
    bedrock: 'bool',
  },
}

export default tiles
