import GameServerMessage from '../../types/GameServerMessage'

const players: GameServerMessage = {
  isArray: true,
  instance: true,
  autoDestroy: true,
  type: {
    id: 'string',
    name: 'string',
    pattern: 'string',
    tilesCount: 'number',
    allyId: 'string',
    alive: 'bool',
    registred: 'bool',
  },
}

export default players
