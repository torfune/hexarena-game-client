import GameServerMessage from '../../types/GameServerMessage'

const onlinePlayers: GameServerMessage = {
  isArray: true,
  autoDestroy: true,
  type: {
    id: 'string',
    name: 'string',
    status: 'string',
    registered: 'bool',
  },
}

export default onlinePlayers
