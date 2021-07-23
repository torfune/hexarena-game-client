import store from '../store'
import Primitive from '../../types/Primitive'
import Prop from '../../types/Prop'
import createProp from '../../utils/createProp'
import { makeAutoObservable } from 'mobx'
import hex from '../functions/hex'
import SoundManager from '../../services/SoundManager'
import ArmyDragManager from './ArmyDragManager'
import Action from './Action'
import { v4 as uuid } from 'uuid'

interface Props {
  [key: string]: Prop<Primitive>
  pattern: Prop<string>
  allyId: Prop<string | null>
  tilesCount: Prop<number>
  gold: Prop<number>
  economy: Prop<number>
  alive: Prop<boolean>
  killerName: Prop<string | null>
  surrendered: Prop<boolean>
  place: Prop<number | null>
  afkKicked: Prop<boolean>
}

class Player {
  props: Props = {
    pattern: createProp(''),
    allyId: createProp(null),
    tilesCount: createProp(0),
    gold: createProp(0),
    economy: createProp(0),
    alive: createProp(true),
    killerName: createProp(''),
    surrendered: createProp(false),
    place: createProp(null),
    afkKicked: createProp(false),
  }

  id: string
  name: string
  ally: Player | null = null

  constructor(id: string, name: string, pattern: string) {
    this.id = id
    this.name = name
    this.props.pattern = createProp(pattern)

    makeAutoObservable(this)
  }

  setProp(key: keyof Props, value: Primitive) {
    if (!store.game) return
    if (this.props[key].current === value) return

    this.props[key].previous = this.props[key].current
    this.props[key].current = value

    switch (key) {
      case 'surrendered': {
        if (this.surrendered) {
          const tiles = Array.from(store.game.tiles.values())
          for (let i = tiles.length - 1; i >= 0; i--) {
            const tile = tiles[i]
            if (tile.image.pattern && tile.owner?.id === this.id) {
              tile.image.pattern.tint = hex('#ccc')
            }
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

      case 'gold': {
        if (this.id !== store.game.playerId) return

        if (this.props[key].previous + 1 === this.gold) {
          SoundManager.play('INCOME')
        }

        const { hoveredTile } = store.game
        if (
          hoveredTile &&
          !hoveredTile.action &&
          store.game.player &&
          !store.game.supplyLinesEditModeActive
        ) {
          const actionType = hoveredTile.getActionType()
          if (
            actionType &&
            !hoveredTile.building?.army &&
            !ArmyDragManager.active
          ) {
            new Action(
              uuid(),
              actionType,
              'PREVIEW',
              hoveredTile,
              store.game.player
            )
          }
        }
      }
    }
  }

  getPattern() {
    if (this.surrendered) {
      return '#ccc'
    } else {
      return this.pattern
    }
  }

  // Prop getters
  get pattern() {
    return this.props.pattern.current
  }
  get allyId() {
    return this.props.allyId.current
  }
  get tilesCount() {
    return this.props.tilesCount.current
  }
  get gold() {
    return this.props.gold.current
  }
  get economy() {
    return this.props.economy.current
  }
  get alive() {
    return this.props.alive.current
  }
  get killerName() {
    return this.props.killerName.current
  }
  get surrendered() {
    return this.props.surrendered.current
  }
  get place() {
    return this.props.place.current
  }
  get afkKicked() {
    return this.props.afkKicked.current
  }
}

export default Player
