import store from '../store'
import messageHandlers from './messageHandlers'
import { IncomingMessage } from './messages'
import GameMode from '../../types/GameMode'
import GameStatus from '../../types/GameStatus'

class Socket {
  connected: boolean = false
  ws?: WebSocket

  connect(
    host: string,
    gameId: string,
    { spectate, accessKey }: { spectate?: boolean; accessKey: string | null }
  ): Promise<{ gameMode: GameMode; gameStatus: GameStatus }> {
    return new Promise((resolve) => {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      this.ws = new WebSocket(`${wsProtocol}//${host}`)

      this.ws.addEventListener('message', this.handleMessage)
      this.ws.addEventListener('error', this.handleError)
      this.ws.addEventListener('close', this.handleClose)
      this.ws.addEventListener('open', () => {
        this.connected = true
        console.log(`Connected to Game Server [${host}]`)

        if (spectate) {
          this.send('spectate', gameId)
        } else {
          this.send('play', `${gameId}|${accessKey}`)
        }

        this.ws!.addEventListener('message', ({ data }: { data: string }) => {
          const [messageName, messagePayload] = data.split('//')

          if (messageName === 'game') {
            const [gameMode, gameStatus] = messagePayload.split('|')

            if (gameMode !== '1v1') {
              throw new Error(`Invalid Game Mode: ${gameMode}`)
            } else if (
              gameStatus !== 'running' &&
              gameStatus !== 'starting' &&
              gameStatus !== 'finished' &&
              gameStatus !== 'aborted'
            ) {
              throw new Error(`Invalid Game Status: ${gameStatus}`)
            }

            console.log(`Connected to Game Instance [${gameId}]`)
            resolve({ gameMode, gameStatus })
          }

          // else if (messageName === 'error') {
          //   store.error = { message: 'Connection failed' }
          //   reject(new Error('Connection failed'))
          // }
        })
      })
    })
  }

  handleMessage({ data }: { data: string }) {
    const [messageName, messagePayload] = data.split('//')

    switch (messageName as IncomingMessage) {
      case 'actions':
        messageHandlers.actions(messagePayload)
        break
      case 'allianceRequests':
        messageHandlers.allianceRequests(messagePayload)
        break
      case 'armies':
        messageHandlers.armies(messagePayload)
        break
      case 'flash':
        messageHandlers.flash(messagePayload)
        break
      case 'forests':
        messageHandlers.forests(messagePayload)
        break
      case 'gameTime':
        messageHandlers.gameTime(messagePayload)
        break
      case 'goldAnimation':
        messageHandlers.goldAnimation(messagePayload)
        break
      case 'incomeAt':
        messageHandlers.incomeAt(messagePayload)
        break
      case 'lastIncomeAt':
        messageHandlers.lastIncomeAt(messagePayload)
        break
      case 'notification':
        messageHandlers.notification(messagePayload)
        break
      case 'playerId':
        messageHandlers.playerId(messagePayload)
        break
      case 'players':
        messageHandlers.players(messagePayload)
        break
      case 'serverTime':
        messageHandlers.serverTime(messagePayload)
        break
      case 'startCountdown':
        messageHandlers.startCountdown(messagePayload)
        break
      case 'spectate':
        messageHandlers.spectate(messagePayload)
        break
      case 'status':
        messageHandlers.status(messagePayload)
        break
      case 'tiles':
        messageHandlers.tiles(messagePayload)
        break
      case 'villages':
        messageHandlers.villages(messagePayload)
        break
      case 'spectators':
        messageHandlers.spectators(messagePayload)
        break
      case 'ping':
        messageHandlers.ping()
        break
      default:
        console.warn(`Unhandled WebSocket message: ${messageName}`)
    }
  }

  handleError(event: Event) {
    console.error(`Socket error!`)
    console.error(event)
  }

  handleClose() {
    this.connected = false
    console.log('Socket closed.')

    store.error = {
      message: 'Disconnected.',
      goHome: false,
    }
  }

  send(message: string, payload: string = '') {
    if (this.ws) {
      this.ws.send(`${message}//${payload}`)
    }
  }
}

export default Socket
