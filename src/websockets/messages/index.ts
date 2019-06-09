import actions from './actions'
import allianceRequests from './allianceRequests'
import alreadyPlaying from './alreadyPlaying'
import armies from './armies'
import chatMessages from './chatMessages'
import GameServerMessage from '../../types/GameServerMessage'
import gameTime from './gameTime'
import goldAnimation from './goldAnimation'
import playerId from './playerId'
import players from './players'
import serverTime from './serverTime'
import startCountdown from './startCountdown'
import status from './status'
import tiles from './tiles'
import flash from './flash'
import notification from './notification'
import waitingTime from './waitingTime'

const messages: {
  [key: string]: GameServerMessage
} = {
  actions,
  allianceRequests,
  alreadyPlaying,
  armies,
  chatMessages,
  gameTime,
  goldAnimation,
  playerId,
  players,
  serverTime,
  startCountdown,
  status,
  tiles,
  flash,
  notification,
  waitingTime,
}

export default messages
