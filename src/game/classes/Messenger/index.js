import io from 'socket.io-client'

import handlePlayer from './handlers/player'
import handleTile from './handlers/tile'
import handleAction from './handlers/action'
import handleId from './handlers/id'
import handleMessages from './handlers/messages'
import handleTime from './handlers/time'
import handleWood from './handlers/wood'
import handleArmy from './handlers/army'
import handleError from './handlers/error'
import handleDefeat from './handlers/defeat'
import handleCountdown from './handlers/countdown'
import handleFinishSeconds from './handlers/finishSeconds'
import handleWin from './handlers/win'
import handleActionQueue from './handlers/actionQueue'
import handleTimesUp from './handlers/timesUp'
import handleDisconnect from './handlers/disconnect'

const GAMESERVER_URL = process.env.REACT_APP_GAMESERVER_URL

class Messenger {
  constructor() {
    this.socket = io(GAMESERVER_URL, { reconnection: false })
      .on('player', handlePlayer.bind(this))
      .on('tile', handleTile.bind(this))
      .on('action', handleAction.bind(this))
      .on('id', handleId.bind(this))
      .on('messages', handleMessages.bind(this))
      .on('time', handleTime.bind(this))
      .on('wood', handleWood.bind(this))
      .on('army', handleArmy.bind(this))
      .on('connect_error', handleError.bind(this))
      .on('defeat', handleDefeat.bind(this))
      .on('countdown', handleCountdown.bind(this))
      .on('finish_seconds', handleFinishSeconds.bind(this))
      .on('win', handleWin.bind(this))
      .on('action_queue', handleActionQueue.bind(this))
      .on('times_up', handleTimesUp.bind(this))
      .on('disconnect', handleDisconnect.bind(this))
  }
  emit = (message, data) => {
    this.socket.emit(message, data)
  }
  close = () => {
    this.socket.close()
  }
}

export default Messenger
