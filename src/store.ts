import { observable } from 'mobx'
import GameServerConfig from './types/GameServerConfig'
import Game from './core/classes/Game'
import { History } from 'history'
import User from './models/User'
import Socket from './websockets/Socket'

class Store {
  @observable game: Game | null = null
  @observable socket: Socket | null = null
  @observable user: User | null = null
  @observable showGuide: boolean = false
  @observable spectating: boolean = false
  @observable gsConfig?: GameServerConfig
  @observable loading: boolean = true
  @observable settings: {
    sound: boolean
  } = {
    sound: false,
  }
  @observable error?: {
    message: string
    goHome?: boolean
  }
  routerHistory: History | null = null
  gsHost: string | null = null
  // @observable chatFocus: boolean = false
  // @observable matchFound: boolean = false
  // @observable chatMessage: string = ''
  // @observable topPlayers: TopPlayer[] = []
  // @observable chatMessages: ChatMessage[] = []
  // @observable finishedGames: FinishedGame[] = []
  // @observable openingTime: number | null = null
  // @observable notification?: Notification
  // @observable queue: {
  //   type: 'NORMAL' | 'RANKED'
  //   currentTime: number
  //   averageTime: number
  //   playerCount: number
  // } | null = null

  // async fetchRunningGames() {
  //   const { data } = await Api.gs.get('/running-games')
  //   if (!data) return
  //
  //   // Sort by elo
  //   const games = [...data].sort((a, b) => {
  //     let eloSumA = 0
  //     for (const players of a.players) {
  //       for (const player of players) {
  //         if (player.elo) {
  //           eloSumA += player.elo
  //         }
  //       }
  //     }
  //
  //     let eloSumB = 0
  //     for (const players of b.players) {
  //       for (const player of players) {
  //         if (player.elo) {
  //           eloSumB += player.elo
  //         }
  //       }
  //     }
  //
  //     return eloSumB - eloSumA
  //   })
  //
  //   // Sort by ranked
  //   store.runningGames = games.sort((a, b) => {
  //     return b.ranked - a.ranked
  //   })
  // }

  // async fetchFinishedGames() {
  //   const { data } = await Api.gs.get('/finished-games')
  //   if (!data) return
  //
  //   store.finishedGames = data
  // }
}

const store = new Store()

export default store
