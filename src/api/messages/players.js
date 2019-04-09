import Player from '../../game/classes/Player'

export default {
  isArray: true,
  class: Player,
  type: {
    id: 'string',
    name: 'string',
    pattern: 'string',
    tilesCount: 'number',
    allyId: 'string',
    alive: 'bool',
  },
}
