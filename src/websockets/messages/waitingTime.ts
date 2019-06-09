import GameServerMessage from '../../types/GameServerMessage'

const waitingTime: GameServerMessage = {
  type: {
    current: 'number',
    average: 'number',
  },
}

export default waitingTime
