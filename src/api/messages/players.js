import Player from '../../game/classes/Player'

export default {
  isArray: true,
  class: Player,
  autoDestroy: true,
  type: {
    id: 'string',
    name: 'string',
    pattern: 'string',
    tilesCount: 'number',
    allyId: 'string',
    alive: 'bool',
  },
}
