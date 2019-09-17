import store from '../../store'
import { Axial } from '../../types/coordinates'

const getTileByAxial = (axial: Axial) => {
  return store.game
    ? store.game.tiles.get(`${axial.x}&${axial.z}`) || null
    : null
}

export default getTileByAxial
