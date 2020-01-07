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
import Unit from '../game/classes/Army/Unit'

// Messages: Gameserver -> Frontend
export type MessageGS =
  | 'actions'
  | 'armies'
  | 'flash'
  | 'forests'
  | 'gameTime'
  | 'goldAnimation'
  | 'incomeAt'
  | 'lastIncomeAt'
  | 'notification'
  | 'playerId'
  | 'players'
  | 'serverTime'
  | 'startCountdown'
  | 'game'
  | 'spectate'
  | 'status'
  | 'tiles'
  | 'villages'
  | 'spectators'
  | 'ping'
  | 'armyJoinStructure'
  | 'battle'
  | 'error'

// Handlers: Gameserver -> Frontend
const messages: {
  [key: string]: (payload: string) => void
} = {
  // Arrays
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
      if (type !== 'TOWER' && type !== 'CASTLE') {
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
  armies: (payload: string) => {
    if (!store.game) return

    const parsed = convertArray(payload, {
      id: 'string',
      tileId: 'string',
      ownerId: 'string',
      unitCount: 'number',
    }) as {
      id: string | null
      tileId: string | null
      ownerId: string | null
      unitCount: number | null
    }[]

    for (let i = 0; i < parsed.length; i++) {
      const fields = parsed[i]
      const { id, tileId, ownerId, unitCount } = fields

      if (!id || !tileId || !ownerId) continue

      let army = store.game.armies.get(id) || null

      // Create
      if (!army) {
        const tile = store.game.tiles.get(tileId) || null
        const owner = store.game.players.get(ownerId) || null
        if (!tile || !owner || !unitCount) continue
        army = new Army(id, tile, owner, unitCount)
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
      productionAt: 'number',
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
      productionAt: number | null
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

  // Objects & Primitives
  flash: (payload: string) => {
    // if (!store.game) return
    // store.game.flash = convert(payload, 'number') as number | null
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

    const serverTime = convert(payload, 'number') as number | null
    const clientTime = Date.now()

    if (serverTime) {
      store.game.timeDiffs.push(clientTime - serverTime)
      if (store.game.timeDiffs.length > 20) {
        store.game.timeDiffs.shift()
      }
      const sum = store.game.timeDiffs.reduce((item, acc) => acc + item, 0)
      store.game.timeDiff = Math.round(sum / store.game.timeDiffs.length)
    }
  },
  startCountdown: (payload: string) => {
    if (!store.game) return
    store.game.startCountdown = convert(payload, 'number') as number | null
  },
  game: (payload: string) => {
    const { id, mode, status } = convertObject(payload, {
      id: 'string',
      mode: 'string',
      status: 'string',
    }) as {
      id: string | null
      mode: string | null
      status: string | null
    }
    if (
      !id ||
      !mode ||
      (mode !== 'DUEL' &&
        mode !== 'TEAMS_2v2' &&
        mode !== 'FFA_6' &&
        mode !== 'TUTORIAL') ||
      !status ||
      (status !== 'STARTING' &&
        status !== 'RUNNING' &&
        status !== 'FINISHED' &&
        status !== 'ABORTED')
    ) {
      return
    }

    if (store.game) {
      store.game.destroy()
    }

    store.game = new Game(id, mode, status)
    store.spectating = false
    if (store.notification) {
      store.notification.close()
    }

    const canvas = document.getElementById('game-canvas')
    if (!canvas) throw new Error('Cannot find game canvas.')
    store.game.render(canvas)
  },
  status: (payload: string) => {
    if (!store.game) return
    const status = convert(payload, 'string') as string | null
    if (
      status === 'STARTING' ||
      status === 'RUNNING' ||
      status === 'FINISHED' ||
      status === 'ABORTED'
    ) {
      store.game.status = status
    }
  },
  spectate: (payload: string) => {
    const { id, mode, status } = convertObject(payload, {
      id: 'string',
      mode: 'string',
      status: 'string',
    }) as {
      id: string | null
      mode: string | null
      status: string | null
    }

    if (
      !id ||
      !mode ||
      (mode !== 'DUEL' && mode !== 'TEAMS_2v2' && mode !== 'FFA_6') ||
      !status ||
      (status !== 'STARTING' &&
        status !== 'RUNNING' &&
        status !== 'FINISHED' &&
        status !== 'ABORTED')
    ) {
      return
    }

    if (store.game) {
      store.game.destroy()
    }

    store.game = new Game(id, mode, status)
    store.game.scale = 0.2
    store.game.targetScale = 0.2
    store.game.setCameraToAxialPosition({ x: 0, z: 0 })
    store.spectating = true
  },
  spectators: (payload: string) => {
    const spectators = Number(payload)
    if (store.game) {
      store.game.spectators = spectators
    }
  },
  ping: () => {},
  armyJoinStructure: (payload: string) => {
    if (!store.game) return

    const id = convert(payload, 'string') as string | null
    if (!id) return

    const army = store.game.armies.get(id)
    if (army) {
      army.joinBuilding()
    }
  },
  battle: (payload: string) => {
    if (!store.game) return

    const {
      attackerId,
      defenderId,
      attackerUnitCount,
      defenderUnitCount,
    } = convertObject(payload, {
      attackerId: 'string',
      defenderId: 'string',
      attackerUnitCount: 'number',
      defenderUnitCount: 'number',
    }) as {
      attackerId: string
      defenderId: string
      attackerUnitCount: number
      defenderUnitCount: number
    }

    const attacker = store.game.armies.get(attackerId)
    const defender = store.game.armies.get(defenderId)
    if (!attacker || !defender) {
      console.log(`Battle failed: attacker or defender missing`)
      return
    }

    const attackerUnits: Unit[] = []
    for (let i = attacker.unitCount - attackerUnitCount - 1; i >= 0; i--) {
      const unit = attacker.units[i]
      if (unit) {
        attackerUnits.push(unit)
        attacker.units.splice(i, 1)
      }
    }
    attacker.props.unitCount.previous = attacker.props.unitCount.current
    attacker.props.unitCount.current = attackerUnitCount

    const defenderUnits: Unit[] = []
    for (let i = defender.unitCount - defenderUnitCount - 1; i >= 0; i--) {
      const unit = defender.units[i]
      if (unit) {
        defenderUnits.push(unit)
        defender.units.splice(i, 1)
      }
    }
    defender.props.unitCount.previous = defender.props.unitCount.current
    defender.props.unitCount.current = defenderUnitCount

    if (attackerUnits.length !== defenderUnits.length) {
      console.log(`Battle failed: attacker and defender units not equal`)
      return
    }

    for (let i = 0; i < attackerUnits.length; i++) {
      const attackerUnit = attackerUnits[i]
      const defenderUnit = defenderUnits[i]

      const attackerPixel = { x: attackerUnit.image.x, y: attackerUnit.image.y }
      let defenderPixel = { x: defenderUnit.image.x, y: defenderUnit.image.y }
      if (defenderUnit.targetPixel) {
        defenderPixel = defenderUnit.targetPixel
      }

      attackerUnit.fight(defenderPixel)
      defenderUnit.fight(attackerPixel)
    }

    if (attackerUnitCount === 0) {
      attacker.destroy()
    }

    if (defenderUnitCount === 0) {
      defender.destroy()
    }
  },
  error: (payload: string) => {
    store.error = payload
  },
}

// Messages: Frontend -> Gameserver
export type MessageFE =
  | 'action'
  | 'cancel'
  | 'sendArmy'
  | 'surrender'
  | 'debug'
  | 'close'
  | 'pattern'
  | 'request'
  | 'sendGold'
  | 'spectate'
  | 'stopSpectate'
  | 'spectators'

export default messages
