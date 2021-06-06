import { configure, makeAutoObservable } from 'mobx'
import GameServerConfig from '../types/GameServerConfig'
import Game from './classes/Game'
import Socket from './websockets/Socket'

configure({
  enforceActions: 'never',
})

class Store {
  game: Game | null = null
  socket: Socket | null = null
  showGuide: boolean = false
  gsConfig?: GameServerConfig
  loading: boolean = true
  settings: {
    sound: boolean
  } = {
    sound: true,
  }
  error?: string
  showLoadingCover: boolean = true

  constructor() {
    makeAutoObservable(this)
  }
}

const store = new Store()

export default store
