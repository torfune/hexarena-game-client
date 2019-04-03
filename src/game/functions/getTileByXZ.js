import store from '../../store'

const getTileByXZ = (x, z) => {
  for (let i = 0; i < store.tiles.length; i++) {
    if (store.tiles[i].x === x && store.tiles[i].z === z) {
      return store.tiles[i]
    }
  }

  return null
}

export default getTileByXZ
