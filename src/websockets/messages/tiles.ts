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
    camp: 'bool',
    forest: 'bool',
    mountain: 'bool',
    village: 'bool',
    bedrock: 'bool',
  },
}

export default tiles
