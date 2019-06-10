import GameServerMessage from '../../types/GameServerMessage'

const waitingTime: GameServerMessage = {
  type: {
    current: 'number',
    average: 'number',
    players: 'number',
  },
}

export default waitingTime
