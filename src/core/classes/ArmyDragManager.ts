import ArmyDragArrow from './ArmyDragArrow'
import Tile from './Tile'
import store from '../store'
import SoundManager from '../../services/SoundManager'
import Building from './Building'
import RoadManager from '../RoadManager'

class ArmyDragManager {
  static active: boolean = false
  static tile: Tile | null = null
  static armyPaths: Tile[][] = []
  static dragArrow: ArmyDragArrow | null = null
  static direction: number | null = null
  static targetBuilding: Building | null = null

  static refresh() {
    if (this.direction === null) return

    this.updateTargetBuilding(this.direction)
    this.clearPathHighlights(this.direction)
    this.addPathHighlights(this.direction)
  }

  static update() {
    if (!this.dragArrow) {
      console.warn(
        'WARN: Cannot update ArmyDragManager because dragArrow is null.'
      )
      return
    }

    this.dragArrow.update()
  }

  static deactivate() {
    if (!this.active) {
      console.warn(
        'WARN: Cannot unselect Army because ArmyDragManager is not active.'
      )
      return
    }

    if (!this.tile) {
      console.warn('WARN: Cannot unselect with null Tile.')
      return
    }

    this.targetBuilding = null

    if (this.dragArrow) {
      this.dragArrow.destroy()
    }

    if (this.direction !== null) {
      this.clearPathHighlights(this.direction)
    }

    if (!this.tile.isHovered() && this.tile.building) {
      this.tile.building.hideHighlight()
    }

    this.active = false
    this.tile = null
    this.armyPaths = []
    this.direction = null
    this.dragArrow = null
    this.targetBuilding = null

    if (store.game?.hoveredTile) {
      store.game.hoveredTile.showActionPreviewIfPossible()
    }
  }

  static startDrag(building: Building) {
    if (this.active) {
      console.warn(
        'WARN: Cannot select Army because ArmyDragManager is already active.'
      )
      return
    }

    this.active = true
    this.tile = building.tile
    this.dragArrow = new ArmyDragArrow(this.tile)

    this.armyPaths = []
    for (let i = 0; i < 6; i++) {
      this.armyPaths[i] = []

      const nextTile = building.tile.neighbors[i]
      if (nextTile) {
        this.armyPaths[i].push(nextTile)
      }

      for (let j = 1; j < store.gsConfig!.ARMY_HP; j++) {
        const lastTile = this.armyPaths[i][this.armyPaths[i].length - 1]
        if (!lastTile) break

        const nextTile = lastTile.neighbors[i]
        if (!nextTile) break

        this.armyPaths[i].push(nextTile)
      }
    }

    SoundManager.play('ARMY_SELECT')
  }

  static sendArmy() {
    if (
      !this.army ||
      !store.socket ||
      !this.tile ||
      this.direction === null ||
      !store.game
    ) {
      console.warn('WARN: Cannot send Army.')
      return
    }

    const { x, z } = this.tile.axial
    store.socket.send('sendArmy', `${x}|${z}|${this.direction}`)
    SoundManager.play('ARMY_SEND')

    if (this.targetBuilding && store.game?.supplyLinesEditModeActive) {
      store.game.createSupplyLine(this.tile, this.targetBuilding.tile)
    }

    if (this.tile.building) {
      this.tile.building.hideHighlight()
    }

    this.deactivate()
  }

  static createSupplyLine() {
    if (!this.targetBuilding || !this.tile || !store.game) {
      console.warn('WARN: Cannot create Supply Line.')
      return
    }

    store.game.createSupplyLine(this.tile, this.targetBuilding.tile)
    this.deactivate()
  }

  static onHoveredTileChange(newHoveredTile: Tile | null) {
    const newDirection = this.getDirection(newHoveredTile)
    this.updateTargetBuilding(newDirection)

    if (newDirection === null) {
      if (this.direction !== null) {
        this.clearPathHighlights(this.direction)
      }
    } else if (newDirection !== this.direction) {
      if (this.direction !== null) {
        this.clearPathHighlights(this.direction)
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
          t.building.showHighlight()
          const road = RoadManager.findRoad(this.tile.building, t.building)
          if (road) {
            RoadManager.setHighlightedRoad(road)
          }
          break
        }
      }

      // Already has Pattern Preview or there is no Army selected
      else if (t.hasPatternPreview() || !this.army) {
      }

      // Block
      else if (t.mountain) {
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

        if (!t.owner) {
          t.building.showHighlight()
          const road = RoadManager.findRoad(this.tile.building, t.building)
          if (road) {
            RoadManager.setHighlightedRoad(road)
          }
          this.targetBuilding = t.building
          break
        } else if (!t.building.isCamp()) {
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
            !n.building &&
            (!n.village || n.village.raided)
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

  static updateTargetBuilding(direction: number | null) {
    if (direction === null) {
      this.targetBuilding = null
      return
    }

    const path = this.armyPaths[direction]
    for (let i = 0; i < path.length; i++) {
      const t = path[i]

      // Friendly Tile
      if (t.isOwnedByThisPlayer() && t.building) {
        this.targetBuilding = t.building
        return
      }
    }

    this.targetBuilding = null
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

        if (this.targetBuilding !== tile.building) {
          tile.building.hideHighlight()
        }
      }

      if (tile.isHovered() && tile.getActionType()) continue

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

  static get army() {
    if (!this.tile) return null

    return this.tile.building ? this.tile.building.army : null
  }
}

export default ArmyDragManager
