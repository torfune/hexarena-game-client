import actions from './actions'
import allianceRequests from './allianceRequests'
import alreadyPlaying from './alreadyPlaying'
import armies from './armies'
import chatMessages from './chatMessages'
import flash from './flash'
import forests from './forests'
import gameIndex from './gameIndex'
import gameMode from './gameMode'
import GameServerMessage from '../../types/GameServerMessage'
import gameTime from './gameTime'
import goldAnimation from './goldAnimation'
import matchFound from './matchFound'
import notification from './notification'
import onlinePlayers from './onlinePlayers'
import playerId from './playerId'
import players from './players'
import serverTime from './serverTime'
import startCountdown from './startCountdown'
import status from './status'
import tiles from './tiles'
import waitingTime from './waitingTime'

const messages: {
  [key: string]: GameServerMessage
} = {
  actions,
  allianceRequests,
  alreadyPlaying,
  armies,
  chatMessages,
  flash,
  forests,
  gameIndex,
  gameMode,
  gameTime,
  goldAnimation,
  matchFound,
  notification,
  onlinePlayers,
  playerId,
  players,
  serverTime,
  startCountdown,
  status,
  tiles,
  waitingTime,
}

export default messages
