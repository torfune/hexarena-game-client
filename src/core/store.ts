import { makeAutoObservable } from 'mobx'
import GameServerConfig from '../types/GameServerConfig'
import Game from './classes/Game'
import Socket from './websockets/Socket'

class Store {
  game: Game | null = null
  socket: Socket | null = null
  showGuide: boolean = false
  spectating: boolean = false
  gsConfig?: GameServerConfig
  loading: boolean = true
  settings: { sound: boolean } = { sound: false }
  error?: {
    message: string
    goHome?: boolean
  }
  gameServerHostname: string | null = null

  constructor() {
    makeAutoObservable(this)
  }
}

const store = new Store()

export default store
