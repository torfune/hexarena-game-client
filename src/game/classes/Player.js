import store from '../../store'

class Player {
  constructor({ id, name, pattern, tilesCount, allyId, alive }) {
    this.id = id
    this.name = name
    this.pattern = pattern
    this.tilesCount = tilesCount
    this.allyId = allyId
    this.alive = alive

    this.ally = allyId ? store.getItemById('players', allyId) : null
  }
  set(key, value) {
    this[key] = value

    switch (key) {
      case 'allyId': {
        this.ally = store.getItemById('players', this.allyId)
        break
      }

      default:
        break
    }
  }
}

export default Player
