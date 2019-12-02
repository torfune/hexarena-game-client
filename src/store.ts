import { observable } from 'mobx'
import GameServerConfig from './types/GameServerConfig'
import Game from './game/classes/Game'
import User from './models/User'

class Store {
  @observable game: Game | null = null
  @observable config: GameServerConfig | null = null
  @observable notification: Notification | null = null
  @observable showGuide: boolean = false
  @observable spectating: boolean = false
  @observable user: User | null = null
  gsHost: string | null = null
}

const store = new Store()

export default store
