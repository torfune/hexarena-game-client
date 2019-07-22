import { observable } from 'mobx'
import GameServerConfig from './types/GameServerConfig'
import ChatMessage from './types/ChatMessage'
import TopPlayer from './types/TopPlayer'
import RunningGame from './types/RunningGame'
import Game from './game/classes/Game'

class Store {
  @observable chatFocus: boolean = false
  @observable matchFound: boolean = false
  @observable chatMessage: string = ''
  @observable topPlayers: TopPlayer[] = []
  @observable chatMessages: ChatMessage[] = []
  @observable spectating: boolean = false
  @observable gsConfig?: GameServerConfig
  @observable runningGames: RunningGame[] = []
  @observable loading: boolean = true
  @observable openingTime: number | null = null
  @observable game: Game | null = null
  @observable waitingTime: {
    current: number
    average: number
    players: number
  } | null = null
  @observable error?: {
    message: string
    goHome?: boolean
  }
  routerHistory?: any
}

const store = new Store()

export default store
