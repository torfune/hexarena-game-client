import Action from '../../game/classes/Action'

export default {
  isArray: true,
  class: Action,
  type: {
    id: 'string',
    type: 'string',
    tileId: 'string',
    ownerId: 'string',
    status: 'string',
    duration: 'number',
    finishedAt: 'number',
  },
}
