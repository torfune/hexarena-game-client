import GameServerMessage from '../../types/GameServerMessage'

const armies: GameServerMessage = {
  isArray: true,
  instance: true,
  type: {
    id: 'string',
    tileId: 'string',
    ownerId: 'string',
    destroyed: 'bool',
  },
}

export default armies
