import actions from './actions'
import allianceRequests from './allianceRequests'
import armies from './armies'
import gameTime from './gameTime'
import playerId from './playerId'
import players from './players'
import status from './status'
import tiles from './tiles'
import villages from './villages'
import gold from './gold'
import alreadyPlaying from './alreadyPlaying'
import startCountdown from './startCountdown'
import chatMessages from './chatMessages'
import GameServerMessage from '../../types/GameServerMessage'

const messages: {
  [key: string]: GameServerMessage
} = {
  actions,
  allianceRequests,
  armies,
  gameTime,
  playerId,
  players,
  status,
  tiles,
  villages,
  gold,
  alreadyPlaying,
  startCountdown,
  chatMessages,
}

export default messages
