import { observable, decorate, computed, action } from 'mobx'
import Tile from './game/classes/Tile'
import GameServerConfig from './types/GameServerConfig'
import Player from './game/classes/Player'
import Action from './game/classes/Action'
import AllianceRequest from './game/classes/AllianceRequest'
import Army from './game/classes/Army'
import ChatMessage from './types/ChatMessage'

type EntityName = 'action' | 'allianceRequest' | 'army' | 'player' | 'tile'
type Entity = Action | AllianceRequest | Army | Player | Tile

interface IdMap<T> {
  [key: string]: T
}

class Store {
  @observable actions: Action[] = []
  @observable allianceRequests: AllianceRequest[] = []
  @observable armies: Army[] = []
  @observable chatMessages: ChatMessage[] = []
  @observable players: Player[] = []
  @observable tiles: Tile[] = []
  @observable winners: Player[] = []
  @observable hoveredTile: Tile | null = null
  @observable startCountdown: number | null = null
  @observable showHud: boolean = true
  @observable spectating: boolean = false
  @observable gold: number = 0
  @observable gsConfig?: GameServerConfig
  @observable playerId?: string
  @observable status?: 'pending' | 'starting' | 'running' | 'finished'
  @observable gameTime?: number
  @observable error?: {
    message: string
    goHome: boolean
  }
  @observable villages?: {
    current: number
    limit: number
  }
  changeHandlers: { [key: string]: (value: any) => void } = {}
  private idMap: {
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

  // Custom Getters
  @computed get player() {
    if (this.players && this.playerId) {
      return this.players.find(p => p.id === this.playerId) || null
    }

    return null
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
      case 'tile':
        collection = this.tiles
        idMap = this.idMap.tiles
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
      case 'tile':
        collection = this.tiles
        idMap = this.idMap.tiles
        break
    }

    if (!collection || !idMap) throw Error(`Invalid entity name: ${entityName}`)

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
  getTile(id: string) {
    const item = this.getItem('tile', id)
    return item ? (item as Tile) : null
  }

  // Public Entity Updaters
  updateAction(id: string, key: string, value: any) {
    const item = this.getItem('action', id)
    if (!item) return
    item.setProp(key, value)
  }
  updateAllianceRequest(id: string, key: string, value: any) {
    const item = this.getItem('allianceRequest', id)
    if (!item) return
    item.setProp(key, value)
  }
  updateArmy(id: string, key: string, value: any) {
    const item = this.getItem('army', id)
    if (!item) return
    item.setProp(key, value)
  }
  updatePlayer(id: string, key: string, value: any) {
    const item = this.getItem('player', id)
    if (!item) return
    item.setProp(key, value)
  }
  updateTile(id: string, key: string, value: any) {
    const item = this.getItem('tile', id)
    if (!item) return
    item.setProp(key, value)
  }

  // Public Entity Removers
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
  removeTile(id: string) {
    this.removeItem('tile', id)
  }

  // Change Listeners
  onChange = (key: string, callback: (current: any) => void) => {
    if (key !== 'tiles' && key !== 'actions') {
      throw Error(`Unsupported change listener: ${key}`)
    }

    this.changeHandlers[key] = callback
  }
}

// const toDecorate = {
//   hoveredTile: observable,
//   showHud: observable,
//   spectating: observable,
//   error: observable,
//   config: observable,
//   winners: observable,
//   player: computed,
//   addItem: action,
//   getItem: action,
//   removeItem: action,
//   updateItem: action,
// }

// for (const key of Object.keys(messages)) {
//   toDecorate[key] = observable
// }

// decorate(Store, toDecorate)

const store = new Store()

export default store
