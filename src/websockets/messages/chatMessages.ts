import GameServerMessage from '../../types/GameServerMessage'

const chatMessages: GameServerMessage = {
  isArray: true,
  type: {
    time: 'number',
    playerName: 'string',
    content: 'string',
  },
}

export default chatMessages
