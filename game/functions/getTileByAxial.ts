import store from '../../store'
import { Axial } from '../../types/coordinates'

const getTileByAxial = (axial: Axial) => {
  for (let i = 0; i < store.tiles.length; i++) {
    const { x, z } = store.tiles[i].axial

    if (x === axial.x && z === axial.z) {
      return store.tiles[i]
    }
  }

  return null
}

export default getTileByAxial
