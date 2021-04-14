import Unit from './Unit'
import getPixelPosition from '../../functions/getPixelPosition'
import getUniqueRandomizedPositions from '../../functions/getUniqueRandomizedPositions'
import store from '../../store'
import Tile from '../Tile'
import Player from '../Player'
import {
  UNIT_COUNT,
  UNIT_RADIUS,
  UNIT_POSITION_OFFSET,
  UNIT_MOVEMENT_SPEED,
  UNIT_DOOR_OFFSET,
} from '../../../constants/constants-game'
import ArmyBar from './ArmyIcon'
import Building from '../Building'

class Army {
  readonly id: string
  readonly owner: Player
  tile: Tile | null = null
  building: Building | null = null
  alpha: number = 1
  animationFraction: number | null = null
  isDestroying: boolean = false
  isMoving: boolean = false
  units: Unit[] = []
  bar: ArmyBar

  constructor(
    id: string,
    owner: Player,
    tile: Tile | null,
    building: Building | null
  ) {
    this.id = id
    this.tile = tile
    this.owner = owner
    this.bar = new ArmyBar(tile || building!.tile)

    const position = getPixelPosition((tile || building!.tile).axial)
    const randomizedPositions = getUniqueRandomizedPositions(
      UNIT_COUNT,
      UNIT_RADIUS,
      position,
      UNIT_POSITION_OFFSET
    )

    for (let i = 0; i < UNIT_COUNT; i++) {
      if (building) {
        this.units.push(new Unit(position.x, position.y))
      } else {
        this.units.push(
          new Unit(randomizedPositions[i].x, randomizedPositions[i].y)
        )
      }
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

        store.game.armies.delete(this.id)
        return
      }
    }

    if (!this.isMoving || this.animationFraction === null) return

    this.animationFraction += UNIT_MOVEMENT_SPEED
    if (this.animationFraction > 1) {
      this.animationFraction = 1
    }

    this.bar.update()

    for (let i = 0; i < UNIT_COUNT; i++) {
      this.units[i].update(this.animationFraction)
    }

    if (this.animationFraction === 1) {
      this.isMoving = false
      this.animationFraction = null
    }
  }

  setTile(newTile: Tile | null) {
    console.log(`ARMY set TILE: `, newTile?.axial || null)

    if (this.building) {
      this.building.setArmy(null)
    }

    if (!newTile) {
      this.tile = null
      return
    }

    this.isMoving = true
    this.animationFraction = 0

    const position = getPixelPosition(newTile.axial)
    const unitPositions = getUniqueRandomizedPositions(
      UNIT_COUNT,
      UNIT_RADIUS,
      position,
      UNIT_POSITION_OFFSET
    )

    this.bar.moveOn(newTile)
    for (let i = 0; i < UNIT_COUNT; i++) {
      this.units[i].moveOn(unitPositions[i].x, unitPositions[i].y)
    }

    this.tile = newTile
  }

  setBuilding(newBuilding: Building | null) {
    console.log(`ARMY set BUILDING: `, newBuilding?.type || null)

    if (this.building) {
      this.building.setArmy(null)
    }

    if (!newBuilding) {
      if (this.building && this.building.army?.id === this.id) {
        this.building.setArmy(null)
      }
      this.building = null
      return
    }

    this.isMoving = true
    this.animationFraction = 0

    const position = getPixelPosition(newBuilding.tile.axial)
    const doorPosition = {
      x: position.x,
      y: position.y + UNIT_DOOR_OFFSET,
    }

    this.bar.moveOn(newBuilding.tile)
    for (let i = 0; i < UNIT_COUNT; i++) {
      this.units[i].moveOn(doorPosition.x, doorPosition.y)
    }

    this.building = newBuilding
    this.building.setArmy(this)
  }

  // leaveBuilding() {
  //   const { gsConfig, game } = store
  //   if (!gsConfig || !game) return
  //
  //   this.isMoving = true
  //   this.animationFraction = 0
  //
  //   const position = getPixelPosition(this.tile.axial)
  //   const randomizedPositions = getUniqueRandomizedPositions(
  //     UNIT_COUNT,
  //     UNIT_RADIUS,
  //     position,
  //     UNIT_POSITION_OFFSET
  //   )
  //
  //   for (let i = 0; i < UNIT_COUNT; i++) {
  //     this.units[i].moveOn(randomizedPositions[i].x, randomizedPositions[i].y)
  //   }
  // }

  destroy() {
    this.isDestroying = true
    this.bar.destroy()

    if (this.building && this.building.army?.id === this.id) {
      this.building.setArmy(null)
    }
  }
}

export default Army
