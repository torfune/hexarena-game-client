const action = {
  x: 'number',
  z: 'number',
  duration: 'number',
  finishedAt: 'number',
  ownerId: 'string',
  status: 'string',
  id: 'string',
  type: 'string',
}

const army = {
  id: 'string',
  x: 'number',
  z: 'number',
  ownerId: 'string',
  isDestroyed: 'bool',
}

const player = {
  id: 'string',
  name: 'string',
  pattern: 'string',
  tilesCount: 'number',
}

const tile = {
  x: 'number',
  z: 'number',
  mountain: 'bool',
  forest: 'bool',
  ownerId: 'string',
  village: 'bool',
  camp: 'bool',
  capital: 'bool',
  castle: 'bool',
  hitpoints: 'number',
}

export default {
  action,
  army,
  player,
  tile,
}
