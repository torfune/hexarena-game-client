import actions from './actions'
import allianceRequests from './allianceRequests'
import alreadyPlaying from './alreadyPlaying'
import armies from './armies'
import chatMessages from './chatMessages'
import GameServerMessage from '../../types/GameServerMessage'
import gameTime from './gameTime'
import gold from './gold'
import playerId from './playerId'
import players from './players'
import serverTime from './serverTime'
import startCountdown from './startCountdown'
import status from './status'
import tiles from './tiles'
import villages from './villages'

const messages: {
  [key: string]: GameServerMessage
} = {
  actions,
  allianceRequests,
  alreadyPlaying,
  armies,
  chatMessages,
  gameTime,
  gold,
  playerId,
  players,
  serverTime,
  startCountdown,
  status,
  tiles,
  villages,
}

export default messages
