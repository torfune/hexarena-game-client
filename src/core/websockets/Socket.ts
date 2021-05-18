import store from '../store'
import messageHandlers from './messageHandlers'
import { IncomingMessage, MessageToSend } from './messages'
import GameMode from '../../types/GameMode'
import GameStatus from '../../types/GameStatus'
import isSpectating from '../../utils/isSpectating'
import { makeAutoObservable } from 'mobx'

const RECONNECT_RATE = 500

class Socket {
  connected: boolean = false
  reconnecting: boolean = false
  host: string
  gameId: string
  accessKey: string | null
  messageQueue: string[] = []
  ws?: WebSocket

  constructor(host: string, gameId: string, accessKey: string | null) {
    this.host = host
    this.gameId = gameId
    this.accessKey = accessKey

    makeAutoObservable(this)
  }

  connect(): Promise<{ gameMode: GameMode; gameStatus: GameStatus }> {
    console.log('Connecting Socket ...')

    return new Promise((resolve, reject) => {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      this.ws = new WebSocket(`${wsProtocol}//${this.host}/ws`)

      this.ws.addEventListener('message', this.handleMessage.bind(this))
      this.ws.addEventListener('error', this.handleError.bind(this))
      this.ws.addEventListener('close', this.handleClose.bind(this))
      this.ws.addEventListener('open', () => {
        this.connected = true
        this.reconnecting = false
        console.log(`Socket connected to Game Server [${this.host}]`)

        if (isSpectating()) {
          this.send('spectate', this.gameId)
        } else {
          this.send('play', `${this.gameId}|${this.accessKey}`)
        }

        this.ws!.addEventListener('message', ({ data }: { data: string }) => {
          const [messageName, messagePayload] = data.split('//')

          if (messageName === 'game') {
            const [gameMode, gameStatus] = messagePayload.split('|')

            if (
              gameMode !== '1v1' &&
              gameMode !== '2v2' &&
              gameMode !== 'FFA-3' &&
              gameMode !== 'FFA-6' &&
              gameMode !== 'AI_1v1' &&
              gameMode !== 'AI_ONLY_1v1' &&
              gameMode !== 'AI_ONLY_FFA-3' &&
              gameMode !== 'AI_ONLY_FFA-6' &&
              gameMode !== 'AI_FFA-3' &&
              gameMode !== 'AI_FFA-6'
            ) {
              throw new Error(`Invalid Game Mode: ${gameMode}`)
            } else if (
              gameStatus !== 'running' &&
              gameStatus !== 'starting' &&
              gameStatus !== 'finished' &&
              gameStatus !== 'aborted'
            ) {
              throw new Error(`Invalid Game Status: ${gameStatus}`)
            }

            console.log(`Connected to Game Instance [${this.gameId}]`)

            // Send messages in queue
            for (const message of this.messageQueue) {
              this.ws?.send(message)
            }
            this.messageQueue = []

            resolve({ gameMode, gameStatus })
          } else if (messageName === 'error') {
            reject(new Error(messagePayload || 'Connection failed.'))
          }
        })
      })
    })
  }

  handleMessage({ data }: { data: string }) {
    const [messageName, messagePayload] = data.split('//')
    // console.log(`${messageName}: `, messagePayload)

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
      case 'supplyLines':
        messageHandlers.supplyLines(messagePayload)
        break
      case 'gameTime':
        messageHandlers.gameTime(messagePayload)
        break
      case 'goldAnimation':
        messageHandlers.goldAnimation(messagePayload)
        break
      case 'attentionNotification':
        messageHandlers.attentionNotification(messagePayload)
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
      case 'status':
        messageHandlers.status(messagePayload)
        break
      case 'tiles':
        messageHandlers.tiles(messagePayload)
        break
      case 'buildings':
        messageHandlers.buildings(messagePayload)
        break
      case 'villages':
        messageHandlers.villages(messagePayload)
        break
      case 'spectators':
        messageHandlers.spectators(messagePayload)
        break
      case 'destroyVillages':
        messageHandlers.destroyVillages(messagePayload)
        break
      case 'destroyArmies':
        messageHandlers.destroyArmies(messagePayload)
        break
      case 'destroyForests':
        messageHandlers.destroyForests(messagePayload)
        break
      case 'destroyActions':
        messageHandlers.destroyActions(messagePayload)
        break
      case 'destroyBuildings':
        messageHandlers.destroyBuildings(messagePayload)
        break
      case 'destroySupplyLines':
        messageHandlers.destroySupplyLines(messagePayload)
        break
      case 'ping':
        messageHandlers.ping()
        break
      case 'error':
        messageHandlers.error(messagePayload)
        break
      default:
        console.warn(`Unhandled WebSocket message: ${messageName}`)
    }
  }

  handleError(event: Event) {
    console.error(`Socket error!`)
    console.error(event)
  }

  handleClose(event: CloseEvent) {
    this.connected = false

    if (
      (event.code === 4000 || event.code === 1006 || !event.wasClean) &&
      store.game?.status === 'running' &&
      !isSpectating()
    ) {
      console.log('Reconnecting ...')
      this.reconnecting = true

      if (this.reconnecting) {
        setTimeout(() => {
          this.connect()
        }, RECONNECT_RATE)
      } else {
        this.connect()
      }
    } else {
      if (!store.error) {
        store.error = 'Disconnected.'
      }
    }
  }

  send(message: MessageToSend, payload: string = '') {
    const data = `${message}//${payload}`

    if (this.reconnecting) {
      this.messageQueue.push(data)
      return
    }

    if (this.ws) {
      this.ws.send(data)
    }
  }
}

export default Socket
