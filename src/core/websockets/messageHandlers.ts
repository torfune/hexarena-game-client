import store from '../store'
import convert from './convert'
import convertObject from './convertObject'
import convertArray from './convertArray'
import Action, { ActionStatus } from '../classes/Action'
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
import isSpectating from '../../utils/isSpectating'
import Building from '../classes/Building'
import SupplyLine from '../classes/SupplyLine'
import RoadManager from '../RoadManager'
import { getInitialCameraAxial } from '../functions/getInitialCameraAxial'

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
      automated: 'boolean',
    }) as {
      id: string
      type: string
      tileId: string
      ownerId: string
      status: string
      duration: number | null
      finishedAt: number | null
      automated: boolean
    }[]

    for (let i = 0; i < parsed.length; i++) {
      const {
        id,
        type,
        tileId,
        ownerId,
        status,
        duration,
        finishedAt,
        automated,
      } = parsed[i]

      if (!id || !type || !tileId || !ownerId) continue
      if (
        type !== 'RECRUIT_ARMY' &&
        type !== 'BUILD_CAMP' &&
        type !== 'BUILD_TOWER' &&
        type !== 'BUILD_CASTLE' &&
        type !== 'REBUILD_VILLAGE'
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
          action = new Action(id, type, status as any, tile, owner)
        }
      }

      // Destroy
      if (status === 'FINISHED') {
        action.destroy()
        return
      }

      // Update
      if (status !== action.status) {
        action.setStatus(status as ActionStatus)
      }
      if (duration && duration !== action.duration) {
        action.setDuration(duration)
      }
      if (finishedAt && finishedAt !== action.finishedAt) {
        action.setFinishedAt(finishedAt)
      }
      if (automated !== action.automated) {
        action.setAutomated(automated)
      }
    }
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
      ownerId: 'string',
      tileId: 'string',
      buildingId: 'string',
    }) as {
      id: string | null
      ownerId: string | null
      tileId: string | null
      buildingId: string | null
    }[]

    for (let i = 0; i < parsed.length; i++) {
      const fields = parsed[i]
      const { id, ownerId, tileId, buildingId } = fields

      if (!id || !ownerId) continue

      let army = store.game.armies.get(id) || null
      const tile = store.game.tiles.get(tileId || '') || null
      const building = store.game.buildings.get(buildingId || '') || null

      // Create
      if (!army) {
        const owner = store.game.players.get(ownerId) || null
        if (!owner) {
          console.error('Army owner not found.')
          continue
        }

        // Army is not visible to this Player
        if (!tile && !building) {
          return
        }

        army = new Army(id, owner, tile, building)
        store.game.armies.set(id, army)
      }

      // Destroy
      if ((tileId && !tile) || (buildingId && !building)) {
        army.destroy()
        return
      }

      // Update
      if (tileId !== (army.tile?.id || null)) {
        army.setTile(tile)
      }
      if (buildingId !== (army.building?.id || null)) {
        army.setBuilding(building)
      }
    }
  },
  tiles: (payload: string) => {
    if (!store.game) return

    const parsed = convertArray(payload, {
      id: 'string',
      x: 'number',
      z: 'number',
      ownerId: 'string',
      mountain: 'boolean',
    }) as {
      id: string | null
      x: number | null
      z: number | null
      ownerId: string | null
      mountain: boolean
    }[]

    let sound: 'VILLAGE_CAPTURE' | 'TILE_CAPTURE' | null = null
    for (let i = 0; i < parsed.length; i++) {
      const fields = parsed[i]
      const { id, x, z, mountain } = fields

      if (!id || x === null || z === null) continue

      let tile = store.game.tiles.get(id) || null

      // Create
      if (!tile) {
        tile = new Tile(id, { x, z }, mountain)
        tile.updateNeighbors()
        for (let i = 0; i < 6; i++) {
          const n = tile.neighbors[i]
          if (n) {
            n.updateNeighbors()
          }
        }
      }

      // Select sound
      const playersId = Array.from(store.game.players.values()).map(
        (player) => player.id
      )
      if (
        (tile.owner?.id !== store.game.playerId &&
          parsed[i].ownerId === store.game.playerId) ||
        (isSpectating() &&
          tile.owner?.id !== parsed[i].ownerId &&
          playersId.includes(parsed[i].ownerId!))
      ) {
        if (tile.village && !tile.village.raided) {
          sound = 'VILLAGE_CAPTURE'
        } else if (!sound) {
          sound = 'TILE_CAPTURE'
        }
      }

      // Update
      const { ownerId } = fields
      if ((!tile.owner && !ownerId) || tile.owner?.id !== ownerId) {
        const owner = ownerId ? store.game.players.get(ownerId) || null : null
        tile.setOwner(owner)
      }
    }

    // Side effects
    if (sound) {
      SoundManager.play(sound)
    }

    if (!store.game.camera && store.game.spawnTile) {
      if (isSpectating()) {
        store.game.setCameraToAxial({ x: 0, z: 0 })
      } else {
        store.game.setCameraToAxial(
          getInitialCameraAxial(store.game.spawnTile.axial)
        )
      }
      store.showLoadingCover = false
    }

    store.game.updateBorders()
  },
  villages: (payload: string) => {
    if (!store.game) return

    const parsed = convertArray(payload, {
      id: 'string',
      tileId: 'string',
      level: 'number',
      yieldDuration: 'number',
      yieldAt: 'number',
      raided: 'boolean',
    }) as {
      id: string | null
      tileId: string | null
      level: number | null
      yieldDuration: number | null
      yieldAt: number | null
      raided: boolean | null
    }[]

    for (let i = 0; i < parsed.length; i++) {
      const fields = parsed[i]
      const { id, tileId, level, yieldAt, yieldDuration, raided } = fields

      if (!id || !tileId || level === null || raided === null) continue

      let village = store.game.villages.get(id)

      // Create
      if (!village) {
        const tile = store.game.tiles.get(tileId)
        if (!tile) continue
        village = new Village(id, tile, raided)
        store.game.villages.set(id, village)
      }

      // Update
      if (level !== village.level) {
        village.setLevel(level)
      }
      if (yieldAt !== village.yieldAt) {
        village.setYieldAt(yieldAt)
      }
      if (yieldDuration !== village.yieldDuration) {
        village.setYieldDuration(yieldDuration)
      }
      if (raided !== village.raided) {
        village.setRaided(raided)
      }
    }
  },
  players: (payload: string) => {
    if (!store.game || store.game.status === 'finished') return

    const parsed = convertArray(payload, {
      id: 'string',
      name: 'string',
      pattern: 'string',
      allyId: 'string',
      tilesCount: 'number',
      gold: 'number',
      economy: 'number',
      alive: 'boolean',
      killerName: 'string',
      surrendered: 'boolean',
      place: 'number',
      afkKicked: 'boolean',
    }) as {
      id: string | null
      name: string | null
      pattern: string | null
      allyId: string | null
      tilesCount: number | null
      gold: number | null
      economy: number | null
      alive: boolean
      killerName: string | null
      surrendered: boolean
      place: number | null
      afkKicked: boolean
    }[]

    for (let i = 0; i < parsed.length; i++) {
      const fields = parsed[i]
      const { id, name, pattern } = fields

      if (!id || !name || !pattern) continue

      let player = store.game.players.get(id)

      // Create
      if (!player) {
        player = new Player(id, name, pattern)
        store.game.players.set(id, player)
      }

      // Update
      updateProps(player, parsed[i])
    }
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
  buildings: (payload: string) => {
    if (!store.game) return

    const parsed = convertArray(payload, {
      id: 'string',
      tileId: 'string',
      type: 'string',
      hp: 'number',
      repairTime: 'number',
    }) as {
      id: string
      tileId: string
      type: string
      hp: number
      repairTime: number
    }[]

    for (let i = 0; i < parsed.length; i++) {
      const fields = parsed[i]
      const { id, tileId, type, hp, repairTime } = fields

      if (
        type !== 'CAPITAL' &&
        type !== 'CAMP' &&
        type !== 'TOWER' &&
        type !== 'CASTLE'
      ) {
        continue
      }

      let building = store.game.buildings.get(id)

      // Create
      if (!building) {
        const tile = store.game.tiles.get(tileId)
        if (!tile) continue
        building = new Building(id, tile, type, hp)
      }

      // Update
      else {
        if (type !== building.type) {
          building.setType(type)
        }

        if (hp !== building.hp) {
          building.setHp(hp)
        }
      }
      if (repairTime !== building.repairTime) {
        building.setRepairTime(repairTime)
      }
    }

    // Update Roads
    RoadManager.update()
  },
  supplyLines: (payload: string) => {
    if (!store.game) return

    const parsed = convertArray(payload, {
      id: 'string',
      sourceTileId: 'string',
      targetTileId: 'string',
    }) as {
      id: string
      sourceTileId: string
      targetTileId: string
    }[]

    for (let i = 0; i < parsed.length; i++) {
      const { id, sourceTileId, targetTileId } = parsed[i]

      let supplyLine = store.game.supplyLines.get(id)

      // Create
      if (!supplyLine) {
        const sourceTile = store.game.tiles.get(sourceTileId)
        const targetTile = store.game.tiles.get(targetTileId)
        if (!sourceTile || !targetTile) continue

        supplyLine = new SupplyLine(id, sourceTile, targetTile)
      }

      // Update
      supplyLine.setConfirmed(true)
    }

    RoadManager.update()
  },

  // - Objects & Primitives -
  flash: (payload: string) => {
    if (!store.game) return
    store.game.flash = convert(payload, 'number') as number | null
    SoundManager.play('VILLAGE_LOSE')
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
      status === 'pending' ||
      status === 'aborted' ||
      status === 'starting' ||
      status === 'running' ||
      status === 'finished'
    ) {
      store.game.status = status

      if (status === 'aborted') {
        store.error = 'Game aborted.'
      }
    }
  },
  spectators: (payload: string) => {
    const spectators = Number(payload)
    if (store.game) {
      store.game.spectators = spectators
    }
  },
  attentionNotification: (payload: string) => {
    const { tileId } = convertObject(payload, {
      tileId: 'string',
    }) as {
      tileId: string
    }

    const tile = store.game!.tiles.get(tileId)
    if (!tile) return

    tile.createAttentionNotification()
  },

  // Clean-up
  destroyVillages: (payload: string) => {
    if (store.game?.status === 'finished') return

    const villagesIds = payload.split('><')
    for (let i = 0; i < villagesIds.length; i++) {
      const village = store.game?.villages.get(villagesIds[i])
      if (village) {
        village.destroy()
      }
    }
  },
  destroyArmies: (payload: string) => {
    if (store.game?.status === 'finished') return

    const armiesIds = payload.split('><')
    for (let i = 0; i < armiesIds.length; i++) {
      const army = store.game?.armies.get(armiesIds[i])
      if (army) {
        army.destroy()
      }
    }
  },
  destroyForests: (payload: string) => {
    if (store.game?.status === 'finished') return

    const forestsIds = payload.split('><')
    for (let i = 0; i < forestsIds.length; i++) {
      const forest = store.game?.forests.get(forestsIds[i])
      if (forest) {
        forest.destroy()
      }
    }
  },
  destroyActions: (payload: string) => {
    if (store.game?.status === 'finished') return

    const actionsIds = payload.split('><')
    for (let i = 0; i < actionsIds.length; i++) {
      const action = store.game?.actions.find(
        (action) => action.id === actionsIds[i]
      )
      if (action) {
        action.destroy()
      }
    }
  },
  destroyBuildings: (payload: string) => {
    if (!store.game || store.game.status === 'finished') return

    const buildingsIds = payload.split('><')
    for (let i = 0; i < buildingsIds.length; i++) {
      const building = store.game.buildings.get(buildingsIds[i])
      if (building) {
        building.destroy()
      }
    }

    // Update Roads
    RoadManager.update()
  },
  destroySupplyLines: (payload: string) => {
    if (!store.game || store.game.status === 'finished') return

    const supplyLinesIds = payload.split('><')
    for (let i = 0; i < supplyLinesIds.length; i++) {
      const supplyLine = store.game.supplyLines.get(supplyLinesIds[i])
      if (supplyLine) {
        supplyLine.destroy()
      }
    }

    // Update Roads
    RoadManager.update()
  },

  ping: () => {},

  error: (errorMessage: string) => {
    console.log(`error from gameserver: ${errorMessage}`)
    store.error = errorMessage
  },
}

export default messageHandlers
