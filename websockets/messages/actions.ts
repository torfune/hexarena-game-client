import GameServerMessage from '../../types/GameServerMessage'

const actions: GameServerMessage = {
  isArray: true,
  instance: true,
  type: {
    id: 'string',
    type: 'string',
    tileId: 'string',
    ownerId: 'string',
    status: 'string',
    duration: 'number',
    finishedAt: 'number',
    order: 'number',
  },
}

export default actions
