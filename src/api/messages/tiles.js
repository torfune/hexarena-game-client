import Tile from '../../game/classes/Tile'

export default {
  isArray: true,
  class: Tile,
  type: {
    id: 'string',
    x: 'number',
    z: 'number',
    ownerId: 'string',
    camp: 'bool',
    capital: 'bool',
    castle: 'bool',
    forest: 'bool',
    mountain: 'bool',
    village: 'bool',
    bedrock: 'bool',
    hitpoints: 'number',
  },
}
