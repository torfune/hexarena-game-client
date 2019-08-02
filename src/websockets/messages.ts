import store from '../store'
import Game from '../game/classes/Game'
import convert from './convert'
import convertObject from './convertObject'
import convertArray from './convertArray'
import Action from '../game/classes/Action'
import getItemById from '../utils/getItemById'
import Tile from '../game/classes/Tile'
import Player from '../game/classes/Player'
import AllianceRequest from '../game/classes/AllianceRequest'
import Army from '../game/classes/Army'
import Village from '../game/classes/Village'
import Forest from '../game/classes/Forest'
import updateProps from '../game/functions/updateProps'
import GoldAnimation from '../game/classes/GoldAnimation'
import Api from '../Api'
import RunningGame from '../types/RunningGame'

// Messages: Gameserver -> Frontend
export type MessageGS =
  | 'actions'
  | 'allianceRequests'
  | 'armies'
  | 'chatMessages'
  | 'flash'
  | 'forests'
  | 'gameTime'
  | 'goldAnimation'
  | 'incomeAt'
  | 'lastIncomeAt'
  | 'matchFound'
  | 'notification'
  | 'playerId'
  | 'players'
  | 'updateRunningGames'
  | 'serverTime'
  | 'startCountdown'
  | 'game'
  | 'spectate'
  | 'status'
  | 'tiles'
  | 'villages'
  | 'waitingTime'
  | 'message'
  | 'spectators'
  | 'ping'

// Handlers: Gameserver -> Frontend
const messages: {
  [key: string]: (payload: string) => void
} = {
  // Arrays
  chatMessages: (payload: string) => {
    store.chatMessages = convertArray(payload, {
      time: 'number',
      playerName: 'string',
      content: 'string',
    }) as {
      time: number
      playerName: string
      content: string
    }[]
  },
  actions: (payload: string) => {
    if (!store.game) return

    const parsed = convertArray(payload, {
      id: 'string',
      type: 'string',
      tileId: 'string',
      ownerId: 'string',
      status: 'string',
      duration: 'number',
      finishedAt: 'number',
    }) as {
      id: string | null
      type: string | null
      tileId: string | null
      ownerId: string | null
      status: string | null
      duration: number | null
      finishedAt: number | null
    }[]

    for (let i = 0; i < parsed.length; i++) {
      const { id, type, tileId, ownerId, status } = parsed[i]

      if (!id || !type || !tileId || !ownerId) continue
      if (
        type !== 'ATTACK' &&
        type !== 'RECRUIT' &&
        type !== 'CAMP' &&
        type !== 'TOWER' &&
        type !== 'CASTLE' &&
        type !== 'HOUSE'
      ) {
        continue
      }

      let action = getItemById(store.game.actions, id)

      // Create
      if (!action) {
        if (status === 'FINISHED') {
          continue
        } else {
          const tile: Tile | null = store.game.tiles[tileId] || null
          const owner: Player | null = store.game.players[ownerId] || null
          if (!tile || !owner) continue
          action = new Action(id, type, tile, owner)
        }
        store.game.actions.push(action)
      }

      // Update
      updateProps(action, parsed[i])
    }

    // Side effects
    store.game.updatePatternPreviews()
  },
  allianceRequests: (payload: string) => {
    if (!store.game) return

    const parsed = convertArray(payload, {
      id: 'string',
      senderId: 'string',
      receiverId: 'string',
      timeout: 'number',
    }) as {
      id: string | null
      senderId: string | null
      receiverId: string | null
      timeout: number | null
    }[]

    const ids: string[] = []
    for (let i = 0; i < parsed.length; i++) {
      const fields = parsed[i]
      const { id, senderId, receiverId, timeout } = fields

      if (!id || !senderId || !receiverId || !timeout) continue

      let request: AllianceRequest | null =
        store.game.allianceRequests[id] || null
      ids.push(id)

      // Create
      if (!request) {
        const sender: Player | null = store.game.players[senderId] || null
        const receiver: Player | null = store.game.players[receiverId] || null
        if (!sender || !receiver) continue
        request = new AllianceRequest(id, sender, receiver)
        store.game.allianceRequests[id] = request
      }

      // Update
      updateProps(request, parsed[i])
    }

    // Auto destroy
    const entries = Object.entries(store.game.allianceRequests)
    for (let i = entries.length - 1; i >= 0; i--) {
      const { id } = entries[i][1]
      if (!ids.includes(id)) {
        delete store.game.allianceRequests[id]
      }
    }
  },
  armies: (payload: string) => {
    if (!store.game) return

    const parsed = convertArray(payload, {
      id: 'string',
      tileId: 'string',
      ownerId: 'string',
      destroyed: 'boolean',
    }) as {
      id: string | null
      tileId: string | null
      ownerId: string | null
      destroyed: number | null
    }[]

    for (let i = 0; i < parsed.length; i++) {
      const fields = parsed[i]
      const { id, tileId, ownerId, destroyed } = fields

      if (!id || !tileId || !ownerId) continue

      let army: Army | null = store.game.armies[id] || null

      // Create
      if (!army) {
        const tile: Tile | null = store.game.tiles[tileId] || null
        const owner: Player | null = store.game.players[ownerId] || null
        if (!tile || !owner || destroyed) continue
        army = new Army(id, tile, owner)
        store.game.armies[id] = army
      }

      // Update
      updateProps(army, parsed[i])
    }
  },
  tiles: (payload: string) => {
    if (!store.game) return

    const parsed = convertArray(payload, {
      id: 'string',
      x: 'number',
      z: 'number',
      ownerId: 'string',
      buildingType: 'string',
      buildingHp: 'number',
      mountain: 'boolean',
      bedrock: 'boolean',
      camp: 'boolean',
    }) as {
      id: string | null
      x: number | null
      z: number | null
      ownerId: string | null
      buildingType: string | null
      buildingHp: number | null
      mountain: boolean
      bedrock: boolean
      camp: boolean
    }[]

    for (let i = 0; i < parsed.length; i++) {
      const fields = parsed[i]
      const { id, x, z, mountain, bedrock } = fields

      if (!id || x === null || z === null) continue

      let tile: Tile | null = store.game.tiles[id] || null

      // Create
      if (!tile) {
        tile = new Tile(id, { x, z }, mountain, bedrock)
        store.game.tiles[id] = tile
        tile.updateNeighbors()
        for (let i = 0; i < 6; i++) {
          const n = tile.neighbors[i]
          if (n) {
            n.updateNeighbors()
          }
        }
      }

      // Update
      updateProps(tile, parsed[i])
    }

    // Side effects
    if (!store.game.camera && store.game.spawnTile) {
      store.game.setCameraToAxialPosition(store.game.spawnTile.axial)
    }
    store.game.updateBlackOverlays()
    store.game.updateBorders()
    store.game.updatePatternPreviews()
  },
  villages: (payload: string) => {
    if (!store.game) return

    const parsed = convertArray(payload, {
      id: 'string',
      tileId: 'string',
      houseCount: 'number',
    }) as {
      id: string | null
      tileId: string | null
      houseCount: number | null
    }[]

    for (let i = 0; i < parsed.length; i++) {
      const fields = parsed[i]
      const { id, tileId, houseCount } = fields

      if (!id || !tileId || houseCount === null) continue

      let village: Village | null = store.game.villages[id] || null

      // Create
      if (!village) {
        const tile: Tile | null = store.game.tiles[tileId] || null
        if (!tile) continue
        village = new Village(id, tile, houseCount)
        store.game.villages[id] = village
      }

      // Update
      updateProps(village, parsed[i])
    }
  },
  players: (payload: string) => {
    if (!store.game) return

    const parsed = convertArray(payload, {
      id: 'string',
      name: 'string',
      pattern: 'string',
      allyId: 'string',
      tilesCount: 'number',
      gold: 'number',
      economy: 'number',
      alive: 'boolean',
      registered: 'boolean',
      killerName: 'string',
    }) as {
      id: string | null
      name: string | null
      pattern: string | null
      allyId: string | null
      tilesCount: number | null
      gold: number | null
      economy: number | null
      alive: boolean
      registered: boolean
      killerName: string | null
    }[]

    const ids: string[] = []
    for (let i = 0; i < parsed.length; i++) {
      const fields = parsed[i]
      const { id, name, pattern, registered } = fields

      if (!id || !name || !pattern) continue

      let player: Player | null = store.game.players[id] || null
      ids.push(id)

      // Create
      if (!player) {
        player = new Player(id, name, pattern, registered)
        store.game.players[id] = player
      }

      // Update
      updateProps(player, parsed[i])
    }

    // Side effects
    store.game.updatePatternPreviews()
  },
  forests: (payload: string) => {
    if (!store.game) return

    const parsed = convertArray(payload, {
      id: 'string',
      tileId: 'string',
      treeCount: 'number',
    }) as {
      id: string
      tileId: string
      treeCount: number
    }[]

    for (let i = 0; i < parsed.length; i++) {
      const fields = parsed[i]
      const { id, tileId, treeCount } = fields

      if (!id || !tileId || treeCount === null) continue

      let forest: Forest | null = store.game.forests[id] || null

      // Create
      if (!forest) {
        const tile: Tile | null = store.game.tiles[tileId] || null
        if (!tile) continue
        forest = new Forest(id, tile, treeCount)
        store.game.forests[id] = forest
      }

      // Update
      updateProps(forest, parsed[i])
    }
  },

  // Objects & Primitives
  flash: (payload: string) => {
    if (!store.game) return
    store.game.flash = convert(payload, 'number') as number | null
  },
  gameTime: (payload: string) => {
    const time = Number(payload)
    if (store.game) {
      store.game.time = time
    }
  },
  goldAnimation: (payload: string) => {
    if (!store.game) return
    store.game.goldAnimation = convertObject(payload, {
      tileId: 'string',
      count: 'number',
    }) as {
      tileId: string
      count: number
    }

    const { goldAnimation } = store.game
    if (!goldAnimation) return
    const tile: Tile | null = store.game.tiles[goldAnimation.tileId] || null
    if (!tile) return
    new GoldAnimation(tile, goldAnimation.count)
  },
  incomeAt: (payload: string) => {
    if (!store.game) return
    store.game.incomeAt = convert(payload, 'number') as number | null
    if (!store.game.incomeStartedAt) {
      store.game.incomeStartedAt = Date.now() // - store.ping
    }
  },
  lastIncomeAt: (payload: string) => {
    if (!store.game) return
    store.game.lastIncomeAt = convert(payload, 'number') as number | null
    store.game.incomeStartedAt = Date.now() // - store.ping
  },
  matchFound: (payload: string) => {
    store.matchFound = convert(payload, 'boolean') as boolean
  },
  notification: (payload: string) => {
    if (!store.game) return
    store.game.notification = convert(payload, 'string') as string | null
  },
  playerId: (payload: string) => {
    if (!store.game) return
    store.game.playerId = convert(payload, 'string') as string | null
  },
  serverTime: (payload: string) => {
    if (!store.game) return
    store.game.serverTime = convert(payload, 'number') as number | null

    if (store.game.serverTime) {
      store.game.pingArray.push(Date.now() - store.game.serverTime)
      if (store.game.pingArray.length > 20) {
        store.game.pingArray.shift()
      }
      const sum = store.game.pingArray.reduce((item, acc) => acc + item, 0)
      store.game.ping = Math.round(sum / store.game.pingArray.length)
    }
  },
  startCountdown: (payload: string) => {
    if (!store.game) return
    store.game.startCountdown = convert(payload, 'number') as number | null
  },
  game: (payload: string) => {
    const { id, mode, ranked } = convertObject(payload, {
      id: 'string',
      mode: 'string',
      ranked: 'boolean',
    }) as {
      id: string | null
      mode: string | null
      ranked: boolean
    }
    if (!id || !mode || (mode !== '1v1' && mode !== '2v2' && mode !== 'FFA')) {
      return
    }

    if (store.game) {
      store.game.destroy()
    }

    store.game = new Game(id, mode, ranked)
    store.waitingTime = null
    store.matchFound = false
    store.spectating = false

    if (store.routerHistory && store.routerHistory.push) {
      store.routerHistory.push('/game')
    }
  },
  status: (payload: string) => {
    if (!store.game) return
    const status = convert(payload, 'string') as string | null
    if (
      status !== 'starting' &&
      status !== 'running' &&
      status !== 'finished' &&
      status !== 'aborted'
    ) {
      store.game.status = null
    } else {
      store.game.status = status
    }
  },
  waitingTime: (payload: string) => {
    const { current, average, players } = convertObject(payload, {
      current: 'number',
      average: 'number',
      players: 'number',
    }) as {
      current: number | null
      average: number | null
      players: number | null
    }

    if (current === null || average === null || players === null) {
      store.waitingTime = null
      return
    }

    store.waitingTime = { current, average, players }
  },
  spectate: (payload: string) => {
    const { id, mode, ranked } = convertObject(payload, {
      id: 'string',
      mode: 'string',
      ranked: 'boolean',
    }) as {
      id: string | null
      mode: string | null
      ranked: boolean
    }
    if (!id || !mode || (mode !== '1v1' && mode !== '2v2' && mode !== 'FFA')) {
      return
    }

    if (store.game) {
      store.game.destroy()
    }

    store.game = new Game(id, mode, ranked)
    store.spectating = true

    if (store.routerHistory && store.routerHistory.push) {
      store.routerHistory.push(`/spectate?game=${id}`)
    }
  },
  spectators: (payload: string) => {
    const spectators = Number(payload)
    if (store.game) {
      store.game.spectators = spectators
    }
  },
  ping: () => {
    console.log(`ping [${Date.now()}]`)
  },

  // Update requests
  updateRunningGames: () => {
    store.fetchRunningGames()
    store.fetchFinishedGames()
  },
}

// Messages: Gameserver -> Frontend
export type MessageFE =
  | 'action'
  | 'cancel'
  | 'sendArmy'
  | 'surrender'
  | 'debug'
  | 'close'
  | 'chatMessage'
  | 'pattern'
  | 'request'
  | 'playAsGuest'
  | 'playAsUser'
  | 'sendGold'
  | 'cancelQueue'
  | 'spectate'
  | 'stopSpectate'
  | 'acceptMatch'
  | 'declineMatch'
  | 'spectators'

export default messages
