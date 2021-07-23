import Road from '../types/Road'
import store from './store'
import getPixelPosition from './functions/getPixelPosition'
import * as PIXI from 'pixi.js'
import hex from './functions/hex'
import Building from './classes/Building'
import SupplyLine from './classes/SupplyLine'
import { Graphics } from 'pixi.js'
import Tile from './classes/Tile'
import ArmyDragManager from './classes/ArmyDragManager'
import { ROAD_OFFSET_Y } from '../constants/constants-game'
import isSpectating from '../utils/isSpectating'

const ANIMATION_SPEED = 500

const BASIC_LINE = {
  WIDTH: 8,
  ALPHA: 0.1,
  EDIT_MODE_ALPHA: 0.1,
  HIGHLIGHT_ALPHA: 1,
}

const SUPPLY_LINE = {
  WIDTH: 12,
  ALPHA: 0.2,
  EDIT_MODE_ALPHA: 0.8,
  HIGHLIGHT_ALPHA: 1,
  GAP: 24,
  DASH: 48,
}

class RoadManager {
  static roads: Road[] = []
  static animationProgress: number = 0
  static highlightedRoad: Road | null = null

  static update() {
    if (!store.game) return

    const buildings = Array.from(store.game.buildings.values())

    // Prepare new Roads
    const newRoads: Road[] = []
    for (const building of buildings) {
      const { tile } = building

      if (!tile.owner || (!tile.isOwnedByThisPlayer() && !isSpectating())) {
        continue
      }

      for (let i = 0; i < 6; i++) {
        let currentTile = tile.neighbors[i]
        if (
          !currentTile ||
          ((currentTile.mountain || currentTile.forest) &&
            tile.owner.id !== currentTile.owner?.id)
        ) {
          continue
        }

        for (let j = 0; j < store.gsConfig!.ARMY_HP; j++) {
          if (currentTile.building) {
            let road = this.findRoad(building, currentTile.building, newRoads)
            if (
              !road &&
              (!currentTile.owner ||
                currentTile.isOwnedByThisPlayer() ||
                isSpectating())
            ) {
              road = {
                buildings: [building, currentTile.building],
                line: new PIXI.Graphics(),
              }
              newRoads.push(road)
              this.drawRoad(road)
            }
            break
          }

          currentTile = currentTile.neighbors[i]
          if (
            !currentTile ||
            ((currentTile.mountain || currentTile.forest) &&
              tile.owner.id !== currentTile.owner?.id)
          ) {
            break
          }
        }
      }
    }

    // Remove
    for (let i = this.roads.length - 1; i >= 0; i--) {
      const road = this.roads[i]
      const [buildingA, buildingB] = road.buildings
      const exists = !!this.findRoad(buildingA, buildingB, newRoads)
      if (!exists) {
        store.game.pixi.stage.removeChild(road.line)
        this.roads.splice(i, 1)
      }
    }

    // Create and Update
    for (let i = 0; i < newRoads.length; i++) {
      const newRoad = newRoads[i]
      const [buildingA, buildingB] = newRoad.buildings

      const existingRoad = this.findRoad(buildingA, buildingB, this.roads)
      if (!existingRoad) {
        store.game.pixi.stage.addChild(newRoad.line)
        this.roads.push(newRoad)
      } else {
        this.drawRoad(existingRoad)
      }
    }

    // Refresh Army Send Manager
    if (ArmyDragManager.active) {
      ArmyDragManager.refresh()
    }
  }

  static draw() {
    this.animationProgress =
      ((Date.now() % ANIMATION_SPEED) + 1) / ANIMATION_SPEED

    for (let i = 0; i < this.roads.length; i++) {
      const road = this.roads[i]
      this.drawRoad(road)
    }
  }

  static findRoad(
    buildingA: Building,
    buildingB: Building,
    roads: Road[] = this.roads
  ): Road | null {
    for (let i = 0; i < roads.length; i++) {
      const road = roads[i]
      if (
        road.buildings.includes(buildingA) &&
        road.buildings.includes(buildingB)
      ) {
        return road
      }
    }

    return null
  }

  static findSupplyLine(
    buildingA: Building,
    buildingB: Building
  ): SupplyLine | null {
    if (!store.game) return null

    for (const supplyLine of Array.from(store.game.supplyLines.values())) {
      let matchedA = false
      let matchedB = false

      if (
        supplyLine.targetTile.building?.id === buildingA.id ||
        supplyLine.sourceTile.building?.id === buildingA.id
      ) {
        matchedA = true
      }
      if (
        supplyLine.targetTile.building?.id === buildingB.id ||
        supplyLine.sourceTile.building?.id === buildingB.id
      ) {
        matchedB = true
      }

      if (matchedA && matchedB) return supplyLine
    }

    return null
  }

  static drawRoad(road: Road) {
    if (!store.game) return

    const [buildingA, buildingB] = road.buildings
    const supplyLine = this.findSupplyLine(buildingA, buildingB)
    const highlighted = road === this.highlightedRoad

    road.line.clear()

    // Edit Mode
    if (store.game.supplyLinesEditModeActive) {
      // Supply Line Cancel Preview
      if (supplyLine && supplyLine.sourceTile.isHovered()) {
        this.drawBasicLine(road.line, buildingA, buildingB, true)
      }

      // Highlighted Send Path
      else if (
        highlighted &&
        ArmyDragManager.targetBuilding &&
        ArmyDragManager.tile
      ) {
        this.drawSupplyLine(
          road.line,
          ArmyDragManager.tile,
          ArmyDragManager.targetBuilding.tile,
          highlighted
        )
      }

      // Highlighted other Send Path
      else if (
        ArmyDragManager.targetBuilding &&
        ArmyDragManager.tile &&
        supplyLine &&
        supplyLine.sourceTile === ArmyDragManager.tile
      ) {
        this.drawBasicLine(road.line, buildingA, buildingB, highlighted)
      }

      // Existing Supply Line
      else if (supplyLine) {
        this.drawSupplyLine(
          road.line,
          supplyLine.sourceTile,
          supplyLine.targetTile,
          highlighted
        )
      }

      // Basic Line
      else {
        this.drawBasicLine(road.line, buildingA, buildingB, highlighted)
      }
    }

    // Default Mode
    else {
      if (supplyLine) {
        this.drawSupplyLine(
          road.line,
          supplyLine.sourceTile,
          supplyLine.targetTile,
          highlighted
        )
      } else {
        this.drawBasicLine(road.line, buildingA, buildingB, highlighted)
      }
    }

    ;(road.line as any).parentGroup = store.game.roadsGroup
  }

  static drawBasicLine(
    g: Graphics,
    buildingA: Building,
    buildingB: Building,
    highlighted: boolean
  ) {
    const pixelA = getPixelPosition(buildingA.tile.axial)
    const pixelB = getPixelPosition(buildingB.tile.axial)

    let alpha = BASIC_LINE.ALPHA
    if (highlighted) {
      alpha = BASIC_LINE.HIGHLIGHT_ALPHA
    }

    g.lineStyle(BASIC_LINE.WIDTH, hex('#000'), alpha)
    g.moveTo(pixelA.x, pixelA.y - ROAD_OFFSET_Y)
    g.lineTo(pixelB.x, pixelB.y - ROAD_OFFSET_Y)
  }

  static drawSupplyLine(
    g: Graphics,
    sourceTile: Tile,
    targetTile: Tile,
    highlighted: boolean
  ) {
    let alpha = SUPPLY_LINE.ALPHA

    if (store.game?.supplyLinesEditModeActive && !ArmyDragManager.active) {
      alpha = SUPPLY_LINE.EDIT_MODE_ALPHA
    }

    if (highlighted) {
      alpha = SUPPLY_LINE.HIGHLIGHT_ALPHA
    }

    g.lineStyle(SUPPLY_LINE.WIDTH, hex('#000'), alpha)

    const pixelA = getPixelPosition(targetTile.axial)
    const pixelB = getPixelPosition(sourceTile.axial)

    pixelA.y -= ROAD_OFFSET_Y
    pixelB.y -= ROAD_OFFSET_Y

    let gapLeft = 0
    let dashLeft = 0

    if (this.animationProgress > 0) {
      const progressOffset =
        (SUPPLY_LINE.DASH + SUPPLY_LINE.GAP) * this.animationProgress
      if (progressOffset < SUPPLY_LINE.DASH) {
        dashLeft = SUPPLY_LINE.DASH - progressOffset
      } else {
        gapLeft = SUPPLY_LINE.GAP - (progressOffset - SUPPLY_LINE.DASH)
      }
    }

    const dx = pixelB.x - pixelA.x
    const dy = pixelB.y - pixelA.y
    const len = Math.sqrt(dx * dx + dy * dy)
    const normal = { x: dx / len, y: dy / len }

    g.moveTo(pixelA.x + gapLeft * normal.x, pixelA.y + gapLeft * normal.y)

    let progressOnLine = 0
    while (progressOnLine <= len) {
      progressOnLine += gapLeft

      if (dashLeft > 0) {
        progressOnLine += dashLeft
      } else {
        progressOnLine += SUPPLY_LINE.DASH
      }

      if (progressOnLine > len) {
        dashLeft = progressOnLine - len
        progressOnLine = len
      } else {
        dashLeft = 0
      }

      g.lineTo(
        pixelA.x + progressOnLine * normal.x,
        pixelA.y + progressOnLine * normal.y
      )

      progressOnLine += SUPPLY_LINE.GAP

      if (progressOnLine > len && dashLeft === 0) {
        gapLeft = progressOnLine - len
      } else {
        gapLeft = 0
        g.moveTo(
          pixelA.x + progressOnLine * normal.x,
          pixelA.y + progressOnLine * normal.y
        )
      }
    }
  }

  static setHighlightedRoad(road: Road | null) {
    this.highlightedRoad = road
  }
}

export default RoadManager
