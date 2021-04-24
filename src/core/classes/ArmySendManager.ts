import Army from './Army'
import ArmyDragArrow from './ArmyDragArrow'
import Tile from './Tile'
import store from '../store'
import SoundManager from '../../services/SoundManager'
import Building from './Building'
import { v4 as uuid } from 'uuid'
import RoadManager from '../RoadManager'

class ArmySendManager {
  static active: boolean = false
  static army: Army | null = null
  static tile: Tile | null = null
  static armyPaths: Tile[][] = []
  static dragArrow: ArmyDragArrow | null = null
  static direction: number | null = null
  static targetBuilding: Building | null = null

  static update() {
    if (!this.dragArrow) {
      console.warn(
        'WARN: Cannot update ArmySendManager because dragArrow is null.'
      )
      return
    }

    this.dragArrow.update()
  }

  static selectArmy(army: Army) {
    if (!army.building) {
      console.warn('WARN: Cannot select Army with null Building.')
      return
    }

    if (this.active) {
      console.warn(
        'WARN: Cannot select Army because ArmySendManager is already active.'
      )
      return
    }

    this.active = true
    this.army = army
    this.tile = army.building.tile
    this.dragArrow = new ArmyDragArrow(this.tile)

    this.armyPaths = []
    for (let i = 0; i < 6; i++) {
      this.armyPaths[i] = []

      const nextTile = army.building!.tile.neighbors[i]
      if (nextTile) {
        this.armyPaths[i].push(nextTile)
      }

      for (let j = 1; j < store.gsConfig!.ARMY_HP; j++) {
        const lastTile = this.armyPaths[i][this.armyPaths[i].length - 1]
        const nextTile = lastTile.neighbors[i]
        if (!nextTile) break

        this.armyPaths[i].push(nextTile)
      }
    }

    SoundManager.play('ARMY_SELECT')
  }

  static unselectArmy() {
    if (!this.active) {
      console.warn(
        'WARN: Cannot unselect Army because ArmySendManager is not active.'
      )
      return
    }

    if (!this.army) {
      console.warn('WARN: Cannot unselect null Army.')
      return
    }

    if (!this.tile) {
      console.warn('WARN: Cannot unselect with null Tile.')
      return
    }

    if (this.dragArrow) {
      this.dragArrow.destroy()
    }

    if (this.direction !== null) {
      this.clearPathHighlights(this.direction)
    } else if (!this.tile.isHovered) {
      this.tile.removeHoverHexagon()
    }

    this.active = false
    this.army = null
    this.tile = null
    this.armyPaths = []
    this.direction = null
    this.dragArrow = null
    this.targetBuilding = null
  }

  static sendArmy() {
    if (!this.army || !store.socket || !this.tile || this.direction === null) {
      console.warn('WARN: Cannot send Army.')
      return
    }

    const { x, z } = this.tile.axial
    store.socket.send('sendArmy', `${x}|${z}|${this.direction}`)
    SoundManager.play('ARMY_SEND')

    if (this.targetBuilding && store.game?.supplyLinesEditModeActive) {
      const supplyLineId = uuid()

      store.socket.send(
        'createSupplyLine',
        `${supplyLineId}|${this.tile.id}|${this.targetBuilding.tile.id}`
      )
      console.log('supply line create sent')
    }

    this.unselectArmy()
  }

  static onHoveredTileChange(newHoveredTile: Tile | null) {
    const newDirection = this.getDirection(newHoveredTile)

    if (newDirection === null) {
      if (this.direction !== null) {
        this.clearPathHighlights(this.direction)
      }
    } else if (newDirection !== this.direction) {
      if (this.direction !== null) {
        this.clearPathHighlights(this.direction)
      } else {
        this.tile?.removeHoverHexagon()
      }

      this.addPathHighlights(newDirection)
    }

    this.direction = newDirection
  }

  static addPathHighlights(direction: number) {
    if (
      !store.game ||
      !store.game.player ||
      !this.tile ||
      !this.tile.building
    ) {
      return
    }

    const { player } = store.game

    const path = this.armyPaths[direction]
    for (let i = 0; i < path.length; i++) {
      const t = path[i]

      // Friendly Tile
      if (t.isOwnedByThisPlayer()) {
        if (t.building) {
          t.addHoverHexagon()
          const road = RoadManager.findRoad(this.tile.building, t.building)
          if (road) {
            RoadManager.setHighlightedRoad(road)
          }
          this.targetBuilding = t.building
          break
        }
      }

      // Free Tile
      else if (t.hasPatternPreview()) {
      }

      // Block
      else if (t.mountain || t.bedrock) {
        break
      }

      // Forest
      else if (t.forest) {
        t.addPatternPreview(player.pattern)
        break
      }

      // Building
      else if (t.building) {
        t.addPatternPreview(player.pattern)

        if (!t.building.isCamp() || !t.owner) {
          break
        }
      }

      // Village
      else if (t.village && !t.village.raided) {
        t.addPatternPreview(player.pattern)

        for (let direction = 0; direction < 6; direction++) {
          const n = t.getNeighbor(direction)
          if (
            n &&
            !n.hasPatternPreview() &&
            n.owner === t.owner &&
            (!n.building || (n.building.isCamp() && !n.building.army)) &&
            (!n.village || n.village.raided) &&
            !n.bedrock
          ) {
            n.addPatternPreview(player.pattern)
          }
        }
      }

      // Empty Tile
      else {
        t.addPatternPreview(player.pattern)
      }
    }
  }

  static clearPathHighlights(direction: number) {
    if (!store.game || !this.tile || !this.tile.building) {
      return
    }

    const path = this.armyPaths[direction]
    for (let i = 0; i < path.length; i++) {
      const tile = path[i]

      if (tile.building) {
        const road = RoadManager.findRoad(this.tile.building, tile.building)
        if (road) {
          RoadManager.setHighlightedRoad(null)
        }
      }

      if (tile.isHovered() && tile.getActionType()) continue

      tile.removeHoverHexagon()

      if (tile.hasPatternPreview()) {
        for (let j = 0; j < 6; j++) {
          const n = tile.getNeighbor(j)
          if (n && n.hasPatternPreview() && !path.includes(n)) {
            n.removePatternPreview()
          }
        }

        tile.removePatternPreview()
      }
    }
  }

  static getDirection(tile: Tile | null) {
    if (!tile) return null

    let direction = null
    for (let i = 0; i < 6; i++) {
      if (this.armyPaths[i].includes(tile)) {
        direction = i
        break
      }
    }

    return direction
  }
}

export default ArmySendManager
