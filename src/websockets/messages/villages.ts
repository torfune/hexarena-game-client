import GameServerMessage from '../../types/GameServerMessage'

const villages: GameServerMessage = {
  isArray: true,
  instance: true,
  type: {
    id: 'string',
    tileId: 'string',
    houseCount: 'number',
  },
}

export default villages
