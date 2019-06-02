// import Primitive from '../types/Primitive'
// import Action from '../game/classes/Action'
// import store from '../store'
// import Tile from '../game/classes/Tile'

// interface Params {
//   [key: string]: Primitive
// }

// export const createAction = (params: Params) => {
//   const { id, type, tileId, ownerId } = params

//   if (
//     !id ||
//     !type ||
//     !tileId ||
//     !ownerId ||
//     typeof id !== 'string' ||
//     typeof tileId !== 'string' ||
//     typeof ownerId !== 'string' ||
//     (type !== 'attack' &&
//       type !== 'cut' &&
//       type !== 'build' &&
//       type !== 'recruit')
//   ) {
//     throw Error(`Cannot create Action instance.`)
//   }

//   const tile = store.getTile(tileId)
//   const owner = store.getPlayer(ownerId)

//   if (!tile || !owner) {
//     throw Error(`Cannot create Action instance.`)
//   }

//   return new Action(id, type, tile, owner)
// }

// export const createTile = (params: Params) => {
//   const { id, x, z } = params

//   if (
//     !id ||
//     x === null ||
//     z === null ||
//     typeof id !== 'string' ||
//     typeof x !== 'number' ||
//     typeof z !== 'number'
//   ) {
//     throw new Error(`Cannot create Tile instance.`)
//   }

//   return new Tile(id, { x, z })
// }
