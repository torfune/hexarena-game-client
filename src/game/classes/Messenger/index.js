import io from 'socket.io-client'

import handleAction from './handlers/action'
import handleActionQueue from './handlers/actionQueue'
import handleArmy from './handlers/army'
import handleCountdown from './handlers/countdown'
import handleDefeat from './handlers/defeat'
import handleDisconnect from './handlers/disconnect'
import handleError from './handlers/error'
import handleFinishSeconds from './handlers/finishSeconds'
import handleId from './handlers/id'
import handleMessages from './handlers/messages'
import handlePlayer from './handlers/player'
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
      .on('army', handleArmy.bind(this))
      .on('connect_error', handleError.bind(this))
      .on('countdown', handleCountdown.bind(this))
      .on('defeat', handleDefeat.bind(this))
      .on('disconnect', handleDisconnect.bind(this))
      .on('finish_seconds', handleFinishSeconds.bind(this))
      .on('id', handleId.bind(this))
      .on('messages', handleMessages.bind(this))
      .on('player', handlePlayer.bind(this))
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
