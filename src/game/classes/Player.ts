import store from '../../store'
import Primitive from '../../types/Primitive'
import Prop from '../../types/Prop'
import createProp from '../../utils/createProp'
import { computed, observable } from 'mobx'
import hex from '../functions/hex'

interface Props {
  [key: string]: Prop<Primitive>
  pattern: Prop<string>
  allyId: Prop<string | null>
  tilesCount: Prop<number>
  gold: Prop<number>
  economy: Prop<number>
  alive: Prop<boolean>
}

class Player {
  @observable props: Props = {
    pattern: createProp(''),
    allyId: createProp(null),
    tilesCount: createProp(0),
    gold: createProp(0),
    economy: createProp(0),
    alive: createProp(true),
    killerName: createProp(''),
  }

  readonly id: string
  readonly name: string
  readonly registered: boolean
  @observable ally: Player | null = null

  constructor(id: string, name: string, pattern: string, registered: boolean) {
    this.id = id
    this.name = name
    this.props.pattern = createProp(pattern)
    this.registered = registered
  }

  setProp(key: keyof Props, value: Primitive) {
    if (!store.game) return
    if (this.props[key].current === value) return

    this.props[key].previous = this.props[key].current
    this.props[key].current = value

    switch (key) {
      case 'pattern': {
        const tiles = Array.from(store.game.tiles.values())
        for (let i = tiles.length - 1; i >= 0; i--) {
          const tile = tiles[i]
          if (tile.image.pattern && tile.ownerId === this.id) {
            tile.image.pattern.tint = hex(String(value))
          }
        }
        break
      }

      case 'allyId': {
        if (this.allyId) {
          this.ally = store.game.players.get(this.allyId) || null
        }
        break
      }
    }
  }

  // Prop getters
  @computed get pattern() {
    return this.props.pattern.current
  }
  @computed get allyId() {
    return this.props.allyId.current
  }
  @computed get tilesCount() {
    return this.props.tilesCount.current
  }
  @computed get gold() {
    return this.props.gold.current
  }
  @computed get economy() {
    return this.props.economy.current
  }
  @computed get alive() {
    return this.props.alive.current
  }
  @computed get killerName() {
    return this.props.killerName.current
  }
}

export default Player
