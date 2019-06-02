import GameServerMessage from '../../types/GameServerMessage'

const allianceRequests: GameServerMessage = {
  isArray: true,
  autoDestroy: true,
  instance: true,
  type: {
    id: 'string',
    senderId: 'string',
    receiverId: 'string',
    timeout: 'number',
  },
}

export default allianceRequests
