import store from '../store'
import Action from '../game/classes/Action'
import AllianceRequest from '../game/classes/AllianceRequest'
import Army from '../game/classes/Army'
import Player from '../game/classes/Player'
import Tile from '../game/classes/Tile'

interface Data {
  [key: string]: any
}

const createInstance = (key: string, data: Data) => {
  switch (key) {
    case 'actions':
      return createAction(data)
    case 'allianceRequests':
      return createAllianceRequest(data)
    case 'armies':
      return createArmy(data)
    case 'players':
      return createPlayer(data)
    case 'tiles':
      return createTile(data)
  }

  return null
}

const createAction = (data: Data) => {
  const { id, type, tileId, ownerId } = data

  // Type check
  if (
    typeof id !== 'string' ||
    typeof type !== 'string' ||
    typeof tileId !== 'string' ||
    typeof ownerId !== 'string'
  ) {
    return null
  }

  // Action type
  if (
    type !== 'attack' &&
    type !== 'cut' &&
    type !== 'build' &&
    type !== 'recruit'
  ) {
    return null
  }

  // Find entities
  const tile = store.getTile(tileId)
  const owner = store.getPlayer(ownerId)

  // Non-existing entities
  if (!tile || !owner) return null

  // Create instance
  return new Action(id, type, tile, owner)
}

const createAllianceRequest = (data: Data) => {
  const { id, senderId, receiverId } = data

  // Type check
  if (
    typeof id !== 'string' ||
    typeof senderId !== 'string' ||
    typeof receiverId !== 'string'
  ) {
    return null
  }

  // Find entities
  const sender = store.getPlayer(senderId)
  const receiver = store.getPlayer(receiverId)

  // Non-existing entities
  if (!sender || !receiver) return null

  // Create instance
  return new AllianceRequest(id, sender, receiver)
}

const createArmy = (data: Data) => {
  const { id, tileId, ownerId } = data

  // Type check
  if (
    typeof id !== 'string' ||
    typeof tileId !== 'string' ||
    typeof ownerId !== 'string'
  ) {
    return null
  }

  // Find entities
  const tile = store.getTile(tileId)
  const owner = store.getPlayer(ownerId)

  // Non-existing entities
  if (!tile || !owner) return null

  // Create instance
  return new Army(id, tile, owner)
}

const createPlayer = (data: Data) => {
  const { id, name, pattern, registered } = data

  // Type check
  if (
    typeof id !== 'string' ||
    typeof name !== 'string' ||
    typeof pattern !== 'string' ||
    typeof registered !== 'boolean'
  ) {
    return null
  }

  return new Player(id, name, pattern, registered)
}

const createTile = (data: Data) => {
  const { id, x, z, mountain, bedrock } = data

  // Type check
  if (
    typeof id !== 'string' ||
    typeof x !== 'number' ||
    typeof z !== 'number' ||
    typeof mountain !== 'boolean' ||
    typeof bedrock !== 'boolean'
  ) {
    return null
  }

  // Create instance
  return new Tile(id, { x, z }, mountain, bedrock)
}

export default createInstance
