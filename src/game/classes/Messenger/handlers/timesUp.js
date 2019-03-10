import game from '../../..'

const handleTimesUp = ({ players, winnerId }) => {
  game.react.showTimesUpScreen({ players, winnerId, playerId: game.playerId })
}

export default handleTimesUp
