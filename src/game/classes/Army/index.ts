import Unit from './Unit'
import getPixelPosition from '../../functions/getPixelPosition'
import getUniqueRandomizedPositions from '../../functions/getUniqueRandomizedPositions'
import store from '../../../store'
import Tile from '../Tile'
import Player from '../Player'
import {
  UNIT_COUNT,
  UNIT_RADIUS,
  UNIT_POSITION_OFFSET,
  UNIT_MOVEMENT_SPEED,
  UNIT_DOOR_OFFSET,
} from '../../../constants/game'
import Prop from '../../../types/Prop'
import Primitive from '../../../types/Primitive'
import createProp from '../../../utils/createProp'

interface Props {
  [key: string]: Prop<Primitive>
  tileId: Prop<string>
  ownerId: Prop<string>
  destroyed: Prop<boolean>
}

class Army {
  props: Props = {
    tileId: createProp(''),
    ownerId: createProp(''),
    destroyed: createProp(false),
  }

  readonly id: string
  tile: Tile
  owner: Player
  alpha: number = 1
  animationFraction: number | null = null
  isDestroying: boolean = false
  isMoving: boolean = false
  units: Unit[] = []

  constructor(id: string, tile: Tile, owner: Player) {
    this.id = id
    this.tile = tile
    this.owner = owner

    this.props.tileId = createProp(tile.id)
    this.props.ownerId = createProp(owner.id)

    const position = getPixelPosition(tile.axial)
    const randomizedPositions = getUniqueRandomizedPositions(
      UNIT_COUNT,
      UNIT_RADIUS,
      position,
      UNIT_POSITION_OFFSET
    )

    const isInside = tile.building

    for (let i = 0; i < UNIT_COUNT; i++) {
      if (isInside) {
        this.units.push(new Unit(position.x, position.y))
      } else {
        this.units.push(
          new Unit(randomizedPositions[i].x, randomizedPositions[i].y)
        )
      }
    }

    if (isInside) {
      this.tile.addArmy(this)
    }
  }

  setProp(key: keyof Props, value: Primitive) {
    if (!store.game) return

    this.props[key].previous = this.props[key].current
    this.props[key].current = value

    switch (key) {
      case 'tileId':
        this.moveOn(this.tileId)
        break

      case 'destroyed':
        if (this.destroyed) {
          this.destroy()
        }
        break

      case 'ownerId':
        const owner = store.game.players[this.ownerId] || null
        if (owner) {
          this.owner = owner
        }
        break

      default:
        break
    }
  }
  update() {
    if (!store.game) return

    if (this.isDestroying) {
      this.alpha -= 0.02

      for (let i = 0; i < UNIT_COUNT; i++) {
        this.units[i].setAlpha(this.alpha)
      }

      if (this.alpha <= 0) {
        for (let i = 0; i < UNIT_COUNT; i++) {
          this.units[i].destroy()
        }

        delete store.game.armies[this.id]
        return
      }
    }

    if (!this.isMoving || this.animationFraction === null) return

    this.animationFraction += UNIT_MOVEMENT_SPEED
    if (this.animationFraction > 1) {
      this.animationFraction = 1
    }

    for (let i = 0; i < UNIT_COUNT; i++) {
      this.units[i].update(this.animationFraction)
    }

    if (this.animationFraction === 1) {
      this.isMoving = false
      this.animationFraction = null
    }
  }
  moveOn(tileId: string) {
    const { gsConfig, game } = store
    if (!gsConfig || !game) return

    const tile: Tile | null = game.tiles[tileId] || null
    if (!tile) {
      this.destroy()
      return
    }

    if (this.tile.army && this.tile.army.id === this.id) {
      this.tile.removeArmy()
    }

    this.tile = tile
    this.isMoving = true
    this.animationFraction = 0

    const sameOwner = tile.owner && tile.owner.id === this.ownerId
    const allyOwner = tile.owner && tile.owner.id === this.owner.allyId
    const position = getPixelPosition(tile.axial)
    const doorPosition = {
      x: position.x,
      y: position.y + UNIT_DOOR_OFFSET,
    }
    const randomizedPositions = getUniqueRandomizedPositions(
      UNIT_COUNT,
      UNIT_RADIUS,
      position,
      UNIT_POSITION_OFFSET
    )

    for (let i = 0; i < UNIT_COUNT; i++) {
      if (tile.building) {
        this.units[i].moveOn(doorPosition.x, doorPosition.y)
      } else {
        this.units[i].moveOn(randomizedPositions[i].x, randomizedPositions[i].y)
      }
    }

    if (
      (sameOwner || allyOwner) &&
      !this.isDestroying &&
      tile.building &&
      tile.building.hp === gsConfig.HP[tile.building.type]
    ) {
      tile.addArmy(this)
    }
  }
  destroy() {
    this.isDestroying = true

    if (this.tile.army && this.tile.army === this) {
      this.tile.removeArmy()
    }
  }

  // Prop getters
  get tileId() {
    return this.props.tileId.current
  }
  get ownerId() {
    return this.props.ownerId.current
  }
  get destroyed() {
    return this.props.destroyed.current
  }
}

export default Army
