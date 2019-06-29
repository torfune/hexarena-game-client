import actions from './actions'
import allianceRequests from './allianceRequests'
import alreadyPlaying from './alreadyPlaying'
import armies from './armies'
import chatMessages from './chatMessages'
import flash from './flash'
import gameMode from './gameMode'
import GameServerMessage from '../../types/GameServerMessage'
import gameTime from './gameTime'
import goldAnimation from './goldAnimation'
import matchFound from './matchFound'
import notification from './notification'
import playerId from './playerId'
import players from './players'
import serverTime from './serverTime'
import startCountdown from './startCountdown'
import status from './status'
import tiles from './tiles'
import waitingTime from './waitingTime'
import onlinePlayers from './onlinePlayers'
import gameIndex from './gameIndex'

const messages: {
  [key: string]: GameServerMessage
} = {
  actions,
  allianceRequests,
  alreadyPlaying,
  armies,
  chatMessages,
  flash,
  gameMode,
  gameTime,
  goldAnimation,
  notification,
  matchFound,
  playerId,
  players,
  serverTime,
  startCountdown,
  gameIndex,
  status,
  tiles,
  waitingTime,
  onlinePlayers,
}

export default messages
