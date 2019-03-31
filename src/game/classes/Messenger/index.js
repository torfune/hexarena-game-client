import io from 'socket.io-client'
import handleAction from './handlers/action'
import handleActionQueue from './handlers/actionQueue'
import handleAllyDied from './handlers/allyDied'
import handleAllyId from './handlers/allyId'
import handleArmy from './handlers/army'
import handleCountdown from './handlers/countdown'
import handleDefeat from './handlers/defeat'
import handleDisconnect from './handlers/disconnect'
import handleError from './handlers/error'
import handleFinishSeconds from './handlers/finishSeconds'
import handleId from './handlers/id'
import handleMessages from './handlers/messages'
import handlePlayer from './handlers/player'
import handleRequests from './handlers/requests'
import handleServerTime from './handlers/serverTime'
import handleTile from './handlers/tile'
import handleTime from './handlers/time'
import handleTimesUp from './handlers/timesUp'
import handleVillages from './handlers/villages'
import handleWin from './handlers/win'
import handleWood from './handlers/wood'

const GAMESERVER_URL = process.env.REACT_APP_GAMESERVER_URL

class Messenger {
  constructor() {
    this.socket = io(GAMESERVER_URL, { reconnection: false })
      .on('action_queue', handleActionQueue.bind(this))
      .on('action', handleAction.bind(this))
      .on('ally_died', handleAllyDied.bind(this))
      .on('ally_id', handleAllyId.bind(this))
      .on('army', handleArmy.bind(this))
      .on('connect_error', handleError.bind(this))
      .on('countdown', handleCountdown.bind(this))
      .on('defeat', handleDefeat.bind(this))
      .on('disconnect', handleDisconnect.bind(this))
      .on('finish_seconds', handleFinishSeconds.bind(this))
      .on('id', handleId.bind(this))
      .on('messages', handleMessages.bind(this))
      .on('player', handlePlayer.bind(this))
      .on('requests', handleRequests.bind(this))
      .on('server_time', handleServerTime.bind(this))
      .on('tile', handleTile.bind(this))
      .on('time', handleTime.bind(this))
      .on('times_up', handleTimesUp.bind(this))
      .on('villages', handleVillages.bind(this))
      .on('win', handleWin.bind(this))
      .on('wood', handleWood.bind(this))
  }
  emit = (message, data) => {
    this.socket.emit(message, data)
  }
  close = () => {
    this.socket.close()
  }
}

export default Messenger
