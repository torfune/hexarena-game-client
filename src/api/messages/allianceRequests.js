import AllianceRequest from '../../game/classes/AllianceRequest'

export default {
  isArray: true,
  class: AllianceRequest,
  type: {
    id: 'string',
    senderId: 'string',
    receiverId: 'string',
    timeout: 'number',
  },
}