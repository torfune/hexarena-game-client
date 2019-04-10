import { observable, decorate, computed, action } from 'mobx'
import api from './api'

class Store {
  hoveredTile = null
  showHud = true
  spectating = false
  error = null

  constructor() {
    this.changeHandlers = {}
    this.map = {}

    for (const key of Object.keys(api)) {
      if (api[key].isArray) {
        this[key] = []
      } else {
        this[key] = null
      }

      this.map[key] = {}
    }
  }

  get player() {
    return this.players && this.id
      ? this.players.find(p => p.id === this.id)
      : null
  }

  addItem(key, item) {
    this[key].push(item)
  }

  getItem(key, id) {
    if (!this.map[key][id]) {
      let item = null

      for (let i = 0; i < this[key].length; i++) {
        if (this[key][i].id === id) {
          item = this[key][i]
        }
      }

      this.map[key][id] = item
    }

    return this.map[key][id]
  }

  updateItem(key, id, change) {
    const item = this.getItem(key, id)

    if (item && item[change.key] !== change.value) {
      item.set(change.key, change.value)
    }
  }

  removeItem(key, id) {
    for (let i = 0; i < this[key].length; i++) {
      if (this[key][i].id === id) {
        this[key].splice(i, 1)
        delete this.map[key][id]
        return
      }
    }
  }

  onChange = (property, callback) => {
    if (this[property] === undefined) {
      throw new Error(
        `Can't listen to non-existing store property: ${property}`
      )
    }

    this.changeHandlers[property] = callback
  }
}

const toDecorate = {
  hoveredTile: observable,
  showHud: observable,
  spectating: observable,
  error: observable,
  player: computed,
  addItem: action,
  getItem: action,
  removeItem: action,
  updateItem: action,
}

for (const key of Object.keys(api)) {
  toDecorate[key] = observable
}

decorate(Store, toDecorate)

const store = new Store()
window.s = store

export default store
