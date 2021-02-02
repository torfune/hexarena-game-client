import store from '../store'
import Game from '../classes/Game'
import convert from './convert'
import convertObject from './convertObject'
import convertArray from './convertArray'
import Action from '../classes/Action'
import getItemById from '../../utils/getItemById'
import Tile from '../classes/Tile'
import Player from '../classes/Player'
import AllianceRequest from '../classes/AllianceRequest'
import Army from '../classes/Army'
import Village from '../classes/Village'
import Forest from '../classes/Forest'
import updateProps from '../functions/updateProps'
import GoldAnimation from '../classes/GoldAnimation'
import SoundManager from '../../services/SoundManager'

// Handlers: Gameserver -> Frontend
const messageHandlers = {
  // - Arrays -
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
        type !== 'CAPTURE' &&
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
          const tile = store.game.tiles.get(tileId) || null
          const owner = store.game.players.get(ownerId) || null
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

      let request = store.game.allianceRequests.get(id) || null
      ids.push(id)

      // Create
      if (!request) {
        const sender = store.game.players.get(senderId) || null
        const receiver = store.game.players.get(receiverId) || null
        if (!sender || !receiver) continue
        request = new AllianceRequest(id, sender, receiver)
        store.game.allianceRequests.set(id, request)
      }

      // Update
      updateProps(request, parsed[i])
    }

    // Auto destroy
    const entries = Object.entries(store.game.allianceRequests)
    for (let i = entries.length - 1; i >= 0; i--) {
      const { id } = entries[i][1]
      if (!ids.includes(id)) {
        store.game.allianceRequests.delete(id)
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

      let army = store.game.armies.get(id) || null

      // Create
      if (!army) {
        const tile = store.game.tiles.get(tileId) || null
        const owner = store.game.players.get(ownerId) || null
        if (!tile || !owner || destroyed) continue
        army = new Army(id, tile, owner)
        store.game.armies.set(id, army)
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

    let playCaptureSound = false
    for (let i = 0; i < parsed.length; i++) {
      const fields = parsed[i]
      const { id, x, z, mountain, bedrock } = fields

      if (!id || x === null || z === null) continue

      let tile = store.game.tiles.get(id) || null

      // Create
      if (!tile) {
        tile = new Tile(id, { x, z }, mountain, bedrock)
        store.game.tiles.set(id, tile)
        tile.updateNeighbors()
        for (let i = 0; i < 6; i++) {
          const n = tile.neighbors[i]
          if (n) {
            n.updateNeighbors()
          }
        }
      }

      if (
        tile.ownerId !== store.game.playerId &&
        parsed[i].ownerId === store.game.playerId
      ) {
        playCaptureSound = true
      }

      // Update
      updateProps(tile, parsed[i])
    }

    // Side effects
    if (playCaptureSound) {
      SoundManager.play('CAPTURE')
    }
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

      let village = store.game.villages.get(id)

      // Create
      if (!village && houseCount) {
        const tile = store.game.tiles.get(tileId)
        if (!tile) continue
        village = new Village(id, tile, houseCount)
        store.game.villages.set(id, village)
      }

      // Update
      if (village) {
        updateProps(village, parsed[i])
      }
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

    for (let i = 0; i < parsed.length; i++) {
      const fields = parsed[i]
      const { id, name, pattern, registered } = fields

      if (!id || !name || !pattern) continue

      let player = store.game.players.get(id)

      // Create
      if (!player) {
        player = new Player(id, name, pattern, registered)
        store.game.players.set(id, player)
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

      let forest = store.game.forests.get(id)

      // Create
      if (!forest && treeCount) {
        const tile = store.game.tiles.get(tileId)
        if (!tile) continue
        forest = new Forest(id, tile, treeCount)
        store.game.forests.set(id, forest)
      }

      // Update
      if (forest) {
        updateProps(forest, parsed[i])
      }
    }
  },

  // - Objects & Primitives -
  flash: (payload: string) => {
    if (!store.game) return
    store.game.flash = convert(payload, 'number') as number | null
  },
  gameTime: (payload: string) => {
    const time = Number(payload)
    if (store.game) {
      store.game.setTime(time)
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
    const tile = store.game.tiles.get(goldAnimation.tileId)
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
  spectate: (payload: string) => {
    console.warn('spectate unhandled')

    // const { id, mode, ranked } = convertObject(payload, {
    //   id: 'string',
    //   mode: 'string',
    //   ranked: 'boolean',
    // }) as {
    //   id: string | null
    //   mode: string | null
    //   ranked: boolean
    // }
    // if (!id || !mode || (mode !== '1v1' && mode !== '2v2' && mode !== 'FFA')) {
    //   return
    // }
    //
    // if (store.game) {
    //   store.game.destroy()
    // }
    //
    // store.game = new Game(id, mode, ranked)
    // store.game.scale = 0.2
    // store.game.targetScale = 0.2
    // store.game.setCameraToAxialPosition(
    //   { x: 0, z: 0 },
    //   Number(CHAT_WIDTH.replace('px', ''))
    // )
    // store.spectating = true
    //
    // if (store.routerHistory && store.routerHistory.push) {
    //   store.routerHistory.push(`/spectate?game=${id}`)
    // }
  },
  spectators: (payload: string) => {
    const spectators = Number(payload)
    if (store.game) {
      store.game.spectators = spectators
    }
  },
  ping: () => {},
}

export default messageHandlers
