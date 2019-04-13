import store from '../../store'
import { extendObservable } from 'mobx'

class Player {
  constructor({ id, name, pattern, tilesCount, allyId, alive }) {
    extendObservable(this, {
      id,
      name,
      pattern,
      tilesCount,
      allyId,
      ally: allyId ? store.getItem('players', allyId) : null,
      alive,
    })
  }
  set(key, value) {
    this[key] = value

    switch (key) {
      case 'allyId': {
        this.ally = store.getItem('players', this.allyId)
        break
      }

      default:
        break
    }
  }
}

export default Player
