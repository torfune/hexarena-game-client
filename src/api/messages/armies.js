import Army from '../../game/classes/Army'

export default {
  isArray: true,
  class: Army,
  type: {
    id: 'string',
    tileId: 'string',
    ownerId: 'string',
    isDestroyed: 'bool',
  },
}
