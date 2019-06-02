import GameServerMessage from '../../types/GameServerMessage'

const chatMessages: GameServerMessage = {
  isArray: true,
  type: {
    playerName: 'string',
    content: 'string',
  },
}

export default chatMessages
