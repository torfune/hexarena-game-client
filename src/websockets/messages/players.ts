import GameServerMessage from '../../types/GameServerMessage'

const players: GameServerMessage = {
  isArray: true,
  instance: true,
  autoDestroy: true,
  type: {
    id: 'string',
    name: 'string',
    pattern: 'string',
    allyId: 'string',
    tilesCount: 'number',
    gold: 'number',
    economy: 'number',
    houses: 'number',
    alive: 'bool',
    registered: 'bool',
    killerName: 'string',
  },
}

export default players
