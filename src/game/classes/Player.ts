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
  villages: Prop<number>
  alive: Prop<boolean>
}

class Player {
  @observable props: Props = {
    pattern: createProp(''),
    allyId: createProp(null),
    tilesCount: createProp(0),
    gold: createProp(0),
    villages: createProp(0),
    alive: createProp(true),
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
    this.props[key].previous = this.props[key].current
    this.props[key].current = value

    switch (key) {
      case 'pattern': {
        for (let i = 0; i < store.tiles.length; i++) {
          const tile = store.tiles[i]

          if (tile.image.pattern && tile.ownerId === this.id) {
            tile.image.pattern.tint = hex(String(value))
          }
        }
        break
      }

      case 'allyId': {
        if (this.allyId) {
          this.ally = store.getPlayer(this.allyId)
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
  @computed get villages() {
    return this.props.villages.current
  }
  @computed get alive() {
    return this.props.alive.current
  }
}

// player.pattern
// player.props.pattern.current

export default Player
