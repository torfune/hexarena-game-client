import { observable, computed } from 'mobx'
import Tile from './game/classes/Tile'
import GameServerConfig from './types/GameServerConfig'
import Player from './game/classes/Player'
import Action from './game/classes/Action'
import AllianceRequest from './game/classes/AllianceRequest'
import Army from './game/classes/Army'
import ChatMessage from './types/ChatMessage'
import TopPlayer from './types/TopPlayer'
import Primitive from './types/Primitive'
import RunningGame from './types/RunningGame'
import GameMode from './types/GameMode'
import Game from './game/classes/Game'

type EntityName = 'action' | 'allianceRequest' | 'army' | 'player' | 'tile'
type Entity = Action | AllianceRequest | Army | Player | Tile

interface IdMap<T> {
  [key: string]: T
}

interface Tiles {
  [key: string]: Tile
}

class Store {
  // Game
  @observable actions: Action[] = []
  @observable allianceRequests: AllianceRequest[] = []
  @observable armies: Army[] = []
  @observable players: Player[] = []
  @observable timeFromActivity: number = 0
  @observable tiles: Tiles = {}
  @observable hoveredTile: Tile | null = null
  @observable startCountdown: number | null = null
  @observable showHud: boolean = true
  @observable fps: number = 0
  @observable ping: number = 0
  @observable status?: 'starting' | 'running' | 'finished' | 'aborted'
  @observable gameTime?: number
  @observable serverTime?: number
  @observable playerId?: string
  @observable notification?: string
  @observable goldAnimation?: { tileId: string; count: number }
  @observable gameMode?: GameMode
  @observable flash: number = 0
  @observable spawnTile?: Tile
  changeHandlers: { [key: string]: () => void } = {}
  gameIndex: number | null = 0
  idMap: {
    actions: IdMap<Action>
    allianceRequests: IdMap<AllianceRequest>
    armies: IdMap<Army>
    players: IdMap<Player>
    tiles: IdMap<Tile>
  } = {
    actions: {},
    allianceRequests: {},
    armies: {},
    players: {},
    tiles: {},
  }

  // Other
  @observable chatMessage: string = ''
  @observable onlinePlayers: OnlinePlayer[] = []
  @observable topPlayers: TopPlayer[] = []
  @observable chatMessages: ChatMessage[] = []
  @observable spectating: boolean = false
  @observable waitingTime: {
    current: number
    average: number
    players: number
  } | null = null
  @observable gsConfig?: GameServerConfig
  @observable error?: {
    message: string
    goHome?: boolean
  }
  @observable runningGames: RunningGame[] = []
  @observable loading: boolean = true
  @observable openingTime: number | null = null
  _game: Game | null = null
  routerHistory?: any

  // Custom Getters
  @computed get player() {
    if (this.players && this.playerId) {
      return this.players.find(p => p.id === this.playerId) || null
    }

    return null
  }

  // Game
  createGame() {
    if (this._game) {
      throw new Error('Game is already initialized!')
    }

    this._game = new Game()
  }
  get game() {
    if (!this._game) {
      throw new Error(`Game is not initialized!`)
    }

    return this._game
  }

  // Dynamic Entity Getter
  private getItem(entityName: EntityName, id: string): Entity | null {
    let collection: Entity[] | null = null
    let idMap: IdMap<Entity> | null = null

    switch (entityName) {
      case 'action':
        collection = this.actions
        idMap = this.idMap.actions
        break
      case 'allianceRequest':
        collection = this.allianceRequests
        idMap = this.idMap.allianceRequests
        break
      case 'army':
        collection = this.armies
        idMap = this.idMap.armies
        break
      case 'player':
        collection = this.players
        idMap = this.idMap.players
        break
    }

    if (!collection || !idMap) throw Error(`Invalid entity name: ${entityName}`)

    if (!idMap[id]) {
      let item = null

      for (let i = 0; i < collection.length; i++) {
        if (collection[i].id === id) {
          item = collection[i]
          break
        }
      }

      if (item) {
        idMap[id] = item
      }
    }

    return idMap[id]
  }

  // Dynamic Entity Remover
  private removeItem(entityName: EntityName, id: string) {
    let collection: Entity[] | null = null
    let idMap: IdMap<Entity> | null = null

    switch (entityName) {
      case 'action':
        collection = this.actions
        idMap = this.idMap.actions
        break
      case 'allianceRequest':
        collection = this.allianceRequests
        idMap = this.idMap.allianceRequests
        break
      case 'army':
        collection = this.armies
        idMap = this.idMap.armies
        break
      case 'player':
        collection = this.players
        idMap = this.idMap.players
        break
    }

    if (!collection || !idMap) throw Error(`Can't remove entity: ${entityName}`)

    for (let i = 0; i < collection.length; i++) {
      if (collection[i].id === id) {
        collection.splice(i, 1)
        delete idMap[id]
        return
      }
    }
  }

  // Public Entity Getters
  getAction(id: string) {
    const item = this.getItem('action', id)
    return item ? (item as Action) : null
  }
  getAllianceRequest(id: string) {
    const item = this.getItem('allianceRequest', id)
    return item ? (item as AllianceRequest) : null
  }
  getArmy(id: string) {
    const item = this.getItem('army', id)
    return item ? (item as Army) : null
  }
  getPlayer(id: string) {
    const item = this.getItem('player', id)
    return item ? (item as Player) : null
  }
  getTile(id: string): Tile | null {
    return this.idMap.tiles[id] || null
  }

  // Update
  updateAction(id: string, key: string, value: any) {
    const item = this.getItem('action', id) as Action
    if (!item) return
    item.setProp(key, value)
  }
  updateAllianceRequest(id: string, key: string, value: any) {
    const item = this.getItem('allianceRequest', id) as AllianceRequest
    if (!item) return
    item.setProp(key, value)
  }
  updateArmy(id: string, key: string, value: any) {
    const item = this.getItem('army', id) as Army
    if (!item) return
    item.setProp(key, value)
  }
  updatePlayer(id: string, key: string, value: any) {
    const item = this.getItem('player', id) as Player
    if (!item) return
    item.setProp(key, value)
  }
  updateTile(id: string, key: string, value: Primitive) {
    const tile = this.getTile(id)
    if (!tile) return
    tile.setProp(key, value)
  }

  // Remove
  removeAction(id: string) {
    this.removeItem('action', id)
  }
  removeAllianceRequest(id: string) {
    this.removeItem('allianceRequest', id)
  }
  removeArmy(id: string) {
    this.removeItem('army', id)
  }
  removePlayer(id: string) {
    this.removeItem('player', id)
  }

  // Add
  addTile(tile: Tile) {
    this.idMap.tiles[tile.id] = tile

    // Update neighbors
    tile.updateNeighbors()
    for (let i = 0; i < 6; i++) {
      const n = tile.neighbors[i]
      if (n) {
        n.updateNeighbors()
      }
    }

    if (!this.spawnTile) {
      this.spawnTile = tile
    }
  }

  // Change Listeners
  onChange = (key: string, callback: () => void) => {
    if (
      key !== 'tiles' &&
      key !== 'actions' &&
      key !== 'serverTime' &&
      key !== 'goldAnimation'
    ) {
      throw Error(`Unsupported change listener: ${key}`)
    }

    this.changeHandlers[key] = callback
  }

  // Reset
  reset() {
    this.actions = []
    this.allianceRequests = []
    this.armies = []
    this.tiles = {}
    this.hoveredTile = null
    this.startCountdown = null
    this.showHud = true
    this.fps = 0
    this.ping = 0
    this.timeFromActivity = 0
    this.gameTime = undefined
    this.serverTime = undefined
    this.notification = undefined
    this.goldAnimation = undefined
    this.gameMode = undefined
    this.flash = 0
    this.spawnTile = undefined
    this.changeHandlers = {}
    this.gameIndex = null
    this.idMap = {
      actions: {},
      allianceRequests: {},
      armies: {},
      players: {},
      tiles: {},
    }
  }
}

const store = new Store()

export default store
