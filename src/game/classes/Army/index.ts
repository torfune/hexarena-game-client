import Unit from './Unit'
import pixelFromAxial from '../../functions/pixelFromAxial'
import store from '../../../store'
import Tile from '../Tile'
import Player from '../Player'
import { UNIT_SCALE, UNIT_DELAY } from '../../../constants/game'
import Prop from '../../../types/Prop'
import Primitive from '../../../types/Primitive'
import createProp from '../../../utils/createProp'
import randomUnitPixels, { Area } from '../../functions/randomUnitPixels'
import UnitPreviewManager from '../UnitPreviewManager'

interface Props {
  [key: string]: Prop<Primitive>
  tileId: Prop<string>
  ownerId: Prop<string>
  unitCount: Prop<number>
}

class Army {
  props: Props = {
    tileId: createProp(''),
    ownerId: createProp(''),
    unitCount: createProp(0),
  }

  readonly id: string
  tile: Tile
  owner: Player
  units: Unit[] = []

  constructor(id: string, tile: Tile, owner: Player, unitCount: number) {
    this.id = id
    this.tile = tile
    this.owner = owner

    this.props.tileId = createProp(tile.id)
    this.props.ownerId = createProp(owner.id)
    this.props.unitCount = createProp(0)

    this.addUnits(unitCount)

    if (tile.building || tile.camp) {
      tile.addArmy(this)
    }
  }

  updateProps(props: string[]) {
    if (!store.game) return

    for (let i = 0; i < props.length; i++) {
      switch (props[i]) {
        case 'tileId':
          this.moveOn(this.tileId)
          break
        case 'ownerId':
          const owner = store.game.players.get(this.ownerId)
          if (owner) {
            this.owner = owner
          }
          break
        case 'unitCount':
          if (this.unitCount === 0) {
            this.destroy()
            return
          }
          const delta = this.unitCount - this.units.length
          if (delta > 0) {
            this.addUnits(delta)
          } else if (delta < 0) {
            this.removeUnits(Math.abs(delta))
          }
          if (this.tile.army && this.tile.army.id === this.id) {
            this.tile.updateArmyIcon()
          }
          break
      }
    }
  }
  moveOn(tileId: string) {
    const { config, game } = store
    if (!config || !game) return

    const tile = game.tiles.get(tileId)
    if (!tile) {
      this.destroy()
      return
    }

    const mergeArmyUnitCount = tile.army ? tile.army.unitCount : 0

    if (this.tile.army && this.tile.army.id === this.id) {
      this.tile.removeArmy()
    }

    this.tile = tile

    const sameOwner = tile.owner && tile.owner.id === this.ownerId
    const allyOwner = tile.owner && tile.owner.id === this.owner.allyId
    const pixel = pixelFromAxial(tile.axial)
    const area = this.positionArea(tile)
    const randomPixels = randomUnitPixels(this.units.length, pixel, area)
    const freeSlots = 6 - mergeArmyUnitCount

    // let message = `move on ${tile.axial.x}|${tile.axial.z}`
    // if (mergeArmyUnitCount) {
    //   message += ` -> ${mergeArmyUnitCount}`
    // }
    // this.log(message)

    if (
      area === 'STRUCTURE' &&
      tile.army &&
      tile.army.id !== this.id &&
      freeSlots > 0
    ) {
      const structurePixels = randomUnitPixels(
        Math.max(this.units.length, freeSlots),
        pixel,
        'STRUCTURE'
      )
      const edgePixels = randomUnitPixels(
        this.units.length - freeSlots,
        pixel,
        this.edgeArea(tile)
      )
      for (let i = 0; i < this.units.length; i++) {
        if (i < freeSlots) {
          this.units[i].moveIn(structurePixels[i], i * UNIT_DELAY)
        } else {
          this.units[i].moveOn(edgePixels[i - freeSlots], i * UNIT_DELAY)
        }
      }
    } else {
      for (let i = 0; i < this.units.length; i++) {
        if (area === 'STRUCTURE') {
          this.units[i].moveIn(randomPixels[i], i * UNIT_DELAY)
        } else {
          this.units[i].moveOn(randomPixels[i], i * UNIT_DELAY)
        }
      }
    }

    if (
      (tile.building || tile.camp) &&
      (sameOwner || allyOwner) &&
      this.unitCount > 0 &&
      !tile.army
    ) {
      tile.addArmy(this)
    }
  }
  addUnits(count: number) {
    if (!store.game) return

    const pixel = pixelFromAxial(this.tile.axial)
    const area = this.positionArea(this.tile)
    const randomPixels = randomUnitPixels(count, pixel, area)

    const units: Unit[] = []
    for (let i = 0; i < count; i++) {
      const unit = new Unit(randomPixels[i])
      if (area === 'STRUCTURE') {
        unit.image.scale.x = UNIT_SCALE.SMALL
        unit.image.scale.y = UNIT_SCALE.SMALL
      }
      units.push(unit)
    }

    const { selectedArmyTile } = store.game
    const selected = !!selectedArmyTile && selectedArmyTile.id === this.tile.id
    if (selected) {
      const edgePixels = randomUnitPixels(
        count,
        pixel,
        this.edgeArea(this.tile)
      )
      for (let i = 0; i < units.length; i++) {
        units[i].moveOn(edgePixels[i])
      }
      store.game.updateArmyTargetTiles()
      store.game.updatePatternPreviews()
      UnitPreviewManager.updatePreviewTiles()
    }

    this.units = this.units.concat(units)
    store.game.units = store.game.units.concat(units)
  }
  removeUnits(count: number) {
    const animate = !this.tile.building && !this.tile.camp
    for (let i = count - 1; i >= 0; i--) {
      this.units[i].destroy(animate)
      this.units.splice(i, 1)
    }
  }
  leaveBuilding() {
    const { config, game } = store
    if (!config || !game) return

    const pixel = pixelFromAxial(this.tile.axial)
    const randomPixels = randomUnitPixels(
      this.units.length,
      pixel,
      this.edgeArea(this.tile)
    )

    for (let i = 0; i < this.units.length; i++) {
      this.units[i].moveOn(randomPixels[i])
      this.units[i].resize('NORMAL')
    }
  }
  joinBuilding() {
    const { config, game } = store
    if (!config || !game) return

    if (!this.tile.army) {
      this.tile.addArmy(this)
    }

    const pixel = pixelFromAxial(this.tile.axial)
    const randomPixels = randomUnitPixels(this.units.length, pixel, 'STRUCTURE')

    for (let i = 0; i < this.units.length; i++) {
      this.units[i].moveIn(randomPixels[i])
    }
  }
  destroy() {
    if (!store.game) return

    this.removeUnits(this.units.length)

    if (this.tile.army && this.tile.army === this) {
      this.tile.removeArmy()
      this.tile.hideArmyIcon()
      this.tile.updateArmyIcon()
    }

    store.game.armies.delete(this.id)
  }
  positionArea(tile: Tile): Area {
    const sameOwner = tile.owner && tile.owner.id === this.ownerId
    const structure = tile.building || tile.camp

    if (
      sameOwner &&
      (tile.mountain ||
        (tile.army &&
          tile.army.unitCount === 6 &&
          tile.army.id !== this.id &&
          this.unitCount > 0))
    ) {
      return this.edgeArea(tile)
    } else if (structure) {
      return 'STRUCTURE'
    }

    return 'FILL'
  }
  edgeArea(tile: Tile) {
    if (tile.camp) return 'EDGE_CAMP'
    if (tile.building) {
      if (tile.building.type === 'TOWER') return 'EDGE_TOWER'
      if (tile.building.type === 'CASTLE') return 'EDGE_CASTLE'
      if (tile.building.type === 'CAPITAL') return 'EDGE_CAPITAL'
    }
    return 'EDGE_MOUNTAIN'
  }
  log(eventMessage?: string) {
    const id = this.id.split('-')[0].toUpperCase()

    let message = `Army[${id}]: (${this.unitCount})`
    if (eventMessage) {
      message += ` - ${eventMessage}`
    }

    console.log(message)
  }

  // Prop getters
  get tileId() {
    return this.props.tileId.current
  }
  get ownerId() {
    return this.props.ownerId.current
  }
  get unitCount() {
    return this.props.unitCount.current
  }
}

export default Army
