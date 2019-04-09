import { observable, decorate, computed, action } from 'mobx'
import api from './api'

class Store {
  constructor() {
    this.changeHandlers = {}
    this.previous = {}

    // Custom store properties
    this.hoveredTile = null
    this.showHUD = true

    for (const key of Object.keys(api)) {
      if (api[key].isArray) {
        this[key] = []
      } else {
        this[key] = null
      }

      this.previous[key] = null
      this[`id_map_${key}`] = {}
    }
  }

  get player() {
    return this.players && this.id
      ? this.players.find(p => p.id === this.id)
      : null
  }

  getItemById(key, id) {
    if (!this[`id_map_${key}`][id]) {
      const item = computed(() => {
        for (let i = 0; i < this[key].length; i++) {
          if (this[key][i].id === id) {
            return this[key][i]
          }
        }

        return null
      })

      this[`id_map_${key}`][id] = item
    }

    return this[`id_map_${key}`][id].get()
  }

  removeItemById(key, id) {
    const collection = this[key]

    for (let i = 0; i < collection.length; i++) {
      if (collection[i].id === id) {
        collection.splice(i, 1)
        delete this[`id_map_${key}`][id]
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
  showHUD: observable,
  player: computed,
  removeItemById: action,
}

for (const key of Object.keys(api)) {
  toDecorate[key] = observable
}

decorate(Store, toDecorate)

const store = new Store()
window.s = store

export default store
