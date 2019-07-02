import store from '../store'
import Action from '../game/classes/Action'
import AllianceRequest from '../game/classes/AllianceRequest'
import Army from '../game/classes/Army'
import Player from '../game/classes/Player'
import Tile from '../game/classes/Tile'
import Forest from '../game/classes/Forest'

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
    case 'forests':
      return createForest(data)
  }
  return null
}

// Action
const createAction = (data: Data) => {
  const { id, type, tileId, ownerId } = data
  if (
    typeof id !== 'string' ||
    typeof type !== 'string' ||
    typeof tileId !== 'string' ||
    typeof ownerId !== 'string'
  ) {
    return null
  }
  if (
    type !== 'ATTACK' &&
    type !== 'BUILD' &&
    type !== 'RECRUIT' &&
    type !== 'UPGRADE'
  ) {
    return null
  }
  const tile = store.getTile(tileId)
  const owner = store.getPlayer(ownerId)
  return !tile || !owner ? null : new Action(id, type, tile, owner)
}

// Alliance Request
const createAllianceRequest = (data: Data) => {
  const { id, senderId, receiverId } = data
  if (
    typeof id !== 'string' ||
    typeof senderId !== 'string' ||
    typeof receiverId !== 'string'
  ) {
    return null
  }
  const sender = store.getPlayer(senderId)
  const receiver = store.getPlayer(receiverId)
  return !sender || !receiver ? null : new AllianceRequest(id, sender, receiver)
}

// Army
const createArmy = (data: Data) => {
  const { id, tileId, ownerId } = data
  if (
    typeof id !== 'string' ||
    typeof tileId !== 'string' ||
    typeof ownerId !== 'string'
  ) {
    return null
  }
  const tile = store.getTile(tileId)
  const owner = store.getPlayer(ownerId)
  return !tile || !owner ? null : new Army(id, tile, owner)
}

// Player
const createPlayer = (data: Data) => {
  const { id, name, pattern, registered } = data
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

// Tile
const createTile = (data: Data) => {
  const { id, x, z, mountain, bedrock } = data
  if (
    typeof id !== 'string' ||
    typeof x !== 'number' ||
    typeof z !== 'number' ||
    typeof mountain !== 'boolean' ||
    typeof bedrock !== 'boolean'
  ) {
    return null
  }
  return new Tile(id, { x, z }, mountain, bedrock)
}

// Forest
const createForest = (data: Data) => {
  const { id, tileId, treeCount } = data
  if (
    typeof id !== 'string' ||
    typeof tileId !== 'string' ||
    typeof treeCount !== 'number'
  ) {
    return null
  }
  const tile = store.getTile(tileId)
  return tile ? new Forest(id, tile, treeCount) : null
}

export default createInstance
