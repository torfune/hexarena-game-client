import GoldAnimation from './GoldAnimation'
import {
  DEFAULT_SCALE,
  ZOOM_SPEED,
  MIN_SCALE,
  MAX_SCALE,
  CAMERA_SPEED,
  MAX_CLICK_DURATION,
  MAX_TOLERATED_UPDATE_DURATION,
} from '../../constants/constants-game'
import createPixiApp from '../functions/createPixiApp'
import store from '../store'
import { Pixel, Axial } from '../../types/coordinates'
import Animation from './Animation'
import pixelToAxial from '../functions/pixelToAxial'
import getPixelPosition from '../functions/getPixelPosition'
import roundToDecimals from '../functions/roundToDecimals'
import getDebugCommand from '../functions/getDebugCommand'
import getTileByAxial from '../functions/getTileByAxial'
import Tile from './Tile'
import { Application } from 'pixi.js'
import Action from './Action'
import { v4 as uuid } from 'uuid'
import { makeAutoObservable } from 'mobx'
import AllianceRequest from './AllianceRequest'
import Army from './Army'
import Player from './Player'
import Forest from './Forest'
import Village from './Village'
import GameMode from '../../types/GameMode'
import SoundManager from '../../services/SoundManager'
import GameStatus from '../../types/GameStatus'
import isSpectating from '../../utils/isSpectating'
import Building from './Building'
import ArmyDragManager from './ArmyDragManager'
import BuildingsConnection from '../../types/Road'
import SupplyLine from './SupplyLine'
import RoadManager from '../RoadManager'
import { Group, Layer } from '../../pixi-layers'
import * as Sentry from '@sentry/browser'
import ArmyDragArrow from './ArmyDragArrow'
import { printSceneGraph } from '../functions/printSceneGraph'

class Game {
  id: string
  mode: GameMode
  allianceRequests: Map<string, AllianceRequest> = new Map()
  armies: Map<string, Army> = new Map()
  players: Map<string, Player> = new Map()
  forests: Map<string, Forest> = new Map()
  villages: Map<string, Village> = new Map()
  tiles: Map<string, Tile> = new Map()
  buildings: Map<string, Building> = new Map()
  supplyLines: Map<string, SupplyLine> = new Map()
  actions: Action[] = []
  hoveredTile: Tile | null = null
  startCountdown: number | null = null
  serverTime: number | null = null
  goldAnimation: { tileId: string; count: number } | null = null
  notification: string | null = null
  flash: number | null = null
  showHud: boolean = true
  fps: number | null = 0
  ping: number | null = 0
  status: GameStatus | null = null
  time: number | null = null
  playerId: string | null = null
  spawnTile: Tile | null = null
  cursor: Pixel | null = null
  spectators: number | null = 0
  scale: number = DEFAULT_SCALE
  targetScale: number = DEFAULT_SCALE
  pixi: Application
  pingArray: number[] = []
  animations: Array<Animation | GoldAnimation> = []
  buildingsConnections: BuildingsConnection[] = []
  camera: Pixel | null = null
  cameraMove: Pixel = { x: 0, y: 0 }
  cameraDrag: { camera: Pixel; cursor: Pixel } | null = null
  dragged: boolean = false
  keyDown: { [key: string]: boolean } = {}
  lastUpdatedAt: number = Date.now()
  eventListeners: {
    mousemove: (event: any) => void
    mousedown: (event: any) => void
    mouseup: (event: any) => void
    keydown: (event: any) => void
    keyup: (event: any) => void
    wheel: (event: any) => void
    resize: (event: any) => void
  } | null = null
  clickedAt: number = 0
  startedAt: number = 0
  supplyLinesEditModeActive = false
  worldSize: number = 0

  // PIXI Groups
  backgroundGroup = new Group(0, false)
  patternsGroup = new Group(1, false)
  bordersGroup = new Group(2, false)
  roadsGroup = new Group(3, false)
  overlayGroup = new Group(4, false)
  dragArrowsGroup = new Group(5, false)
  objectsGroup = new Group(6, true) // buildings,  forests, mountains, villages, armies
  actionsGroup = new Group(7, false)
  fogsGroup = new Group(8, false)

  // Getters (computed)
  get player() {
    return this.playerId ? this.players.get(this.playerId) || null : null
  }

  get gold() {
    return this.player ? this.player.gold : 0
  }

  // Setters (actions)
  setCursor(cursor: Pixel) {
    this.cursor = cursor
  }

  setTime(time: number) {
    this.time = time
  }

  constructor(
    id: string,
    mode: GameMode,
    status: GameStatus,
    worldSize: number,
    container: HTMLElement
  ) {
    this.id = id
    this.mode = mode
    this.status = status
    this.worldSize = worldSize
    this.startedAt = Date.now()

    // Leaving warning
    window.onbeforeunload = () => {
      if (
        this.player &&
        this.player.alive &&
        this.status === 'running' &&
        !isSpectating() &&
        !store.error &&
        !this.player.surrendered &&
        !store.gsConfig?.DEBUG_MODE
      ) {
        return true
      }
    }

    // Event Listeners
    this.setupEventListeners()

    // Pixi Application
    this.pixi = createPixiApp()
    this.pixi.view.id = this.id
    this.pixi.ticker.add(this.update.bind(this))
    container.appendChild(this.pixi.view)

    // Pixi Groups
    this.objectsGroup.on('sort', (sprite: any) => {
      sprite.zOrder = sprite.y
    })

    this.pixi.stage.addChild(new Layer(this.backgroundGroup))
    this.pixi.stage.addChild(new Layer(this.patternsGroup))
    this.pixi.stage.addChild(new Layer(this.roadsGroup))
    this.pixi.stage.addChild(new Layer(this.overlayGroup))
    this.pixi.stage.addChild(new Layer(this.bordersGroup))
    this.pixi.stage.addChild(new Layer(this.dragArrowsGroup))
    this.pixi.stage.addChild(new Layer(this.objectsGroup))
    this.pixi.stage.addChild(new Layer(this.actionsGroup))
    this.pixi.stage.addChild(new Layer(this.fogsGroup))

    // Global debug reference
    ;(window as any).game = this

    makeAutoObservable(this)
  }

  destroy() {
    this.clearEventListeners()

    if (store.game === this) {
      store.game = null
    }

    // Remove canvas element
    const canvas = document.getElementById(this.id)
    if (canvas) {
      canvas.remove()
    }

    this.pixi.destroy()
  }

  update(delta: number) {
    if (!this.camera || !this.pixi || store.error) {
      return
    }

    const startedAt = Date.now()

    // Animations
    for (let i = this.animations.length - 1; i >= 0; i--) {
      this.animations[i].update(delta)
      if (this.animations[i].finished) {
        this.animations.splice(i, 1)
      }
    }

    // Camera
    if (this.cameraDrag && this.cursor !== null) {
      const { camera, cursor } = this.cameraDrag

      this.camera = {
        x: camera.x - (cursor.x - this.cursor.x),
        y: camera.y - (cursor.y - this.cursor.y),
      }

      this.updateStagePosition()
    } else {
      const speed = CAMERA_SPEED
      let cameraChange: Pixel = { x: 0, y: 0 }

      if (this.keyDown['w']) {
        cameraChange.y += speed * (2 / 3)
      }
      if (this.keyDown['s']) {
        cameraChange.y -= speed * (2 / 3)
      }
      if (this.keyDown['a']) {
        cameraChange.x += speed * (2 / 3)
      }
      if (this.keyDown['d']) {
        cameraChange.x -= speed * (2 / 3)
      }

      if (cameraChange.x || cameraChange.y) {
        this.camera.x += cameraChange.x
        this.camera.y += cameraChange.y

        this.pixi.stage.x = this.camera.x
        this.pixi.stage.y = this.camera.y
      }
    }

    // Zoom
    if (this.status === 'running') {
      if (this.scale !== this.targetScale) {
        const pixel = {
          x: window.innerWidth / 2 - this.camera.x,
          y: window.innerHeight / 2 - this.camera.y,
        }
        const axial = pixelToAxial(pixel)

        this.scale = this.targetScale
        this.setCameraToAxial(axial)
      }
    }

    // Actions
    for (let i = 0; i < this.actions.length; i++) {
      const action = this.actions[i]
      if (action.status === 'RUNNING') {
        action.update()
      }
    }

    // Armies
    const armies = Array.from(this.armies.values())
    for (let i = 0; i < armies.length; i++) {
      armies[i].update(delta)
    }

    // Villages
    const villages = Array.from(this.villages.values())
    for (let i = 0; i < villages.length; i++) {
      villages[i].updateBarFill()
    }

    // Buildings
    const buildings = Array.from(this.buildings.values())
    for (let i = 0; i < buildings.length; i++) {
      buildings[i].updateHpRepairBarFill()
    }

    // Army Send Manager
    if (ArmyDragManager.active) {
      ArmyDragManager.update()
    }

    // Animate Supply Lines
    RoadManager.draw()

    // Hovered tile
    this.updateHoveredTile()

    // Measure the performance
    const duration = Date.now() - startedAt
    if (duration > MAX_TOLERATED_UPDATE_DURATION) {
      const message = `Update took ${duration}ms`
      console.log(message)

      const client = Sentry.getCurrentHub().getClient()
      if (client) {
        Sentry.captureMessage(message)
        console.log('Update too long message sent to Sentry.')
      }
    }
  }

  setupEventListeners() {
    this.eventListeners = {
      mousemove: this.handleMouseMove.bind(this),
      mousedown: this.handleMouseDown.bind(this),
      mouseup: this.handleMouseUp.bind(this),
      keydown: this.handleKeyDown.bind(this),
      keyup: this.handleKeyUp.bind(this),
      wheel: this.handleWheelMove.bind(this),
      resize: this.updateScreenSize.bind(this),
    }

    document.addEventListener('mousemove', this.eventListeners.mousemove)
    document.addEventListener('mousedown', this.eventListeners.mousedown)
    document.addEventListener('mouseup', this.eventListeners.mouseup)
    document.addEventListener('keydown', this.eventListeners.keydown)
    document.addEventListener('keyup', this.eventListeners.keyup)
    document.addEventListener('contextmenu', this.handleContextMenu, false)
    document.addEventListener('wheel', this.eventListeners.wheel)
    window.addEventListener('resize', this.eventListeners.resize)
  }

  clearEventListeners() {
    if (!this.eventListeners) return

    document.removeEventListener('mousemove', this.eventListeners.mousemove)
    document.removeEventListener('mousedown', this.eventListeners.mousedown)
    document.removeEventListener('mouseup', this.eventListeners.mouseup)
    document.removeEventListener('keydown', this.eventListeners.keydown)
    document.removeEventListener('keyup', this.eventListeners.keyup)
    document.removeEventListener('contextmenu', this.handleContextMenu, false)
    document.removeEventListener('wheel', this.eventListeners.wheel)
    window.removeEventListener('resize', this.eventListeners.resize)
  }

  updateScreenSize() {
    if (!this.pixi) return

    this.pixi.renderer.resize(window.innerWidth, window.innerHeight)
  }

  selectPattern(pattern: string) {
    if (!store.socket) return

    store.socket.send('pattern', pattern)
  }

  handleKeyDown({ key }: KeyboardEvent) {
    if (this.status !== 'running' || !store.socket) {
      return
    }

    if (key === 'p') {
      printSceneGraph(this.pixi.stage.children)
    }

    this.keyDown[key] = true
    this.updateCameraMove()

    if (key === 'Escape') {
      store.socket.send('cancel')
      return
    }

    if (key === ' ') {
      if (!this.supplyLinesEditModeActive) {
        this.startSupplyLinesEditMode()
      }
    }

    const tile = this.hoveredTile
    if (!tile) return

    if (key === 'Shift' && tile.action) {
      tile.action.startHover()
    }

    const command = getDebugCommand(key)
    if (!command) return

    store.socket.send('debug', `${command}|${tile.axial.x}|${tile.axial.z}`)
  }

  handleKeyUp({ key }: KeyboardEvent) {
    if (this.status !== 'running' || !store.gsConfig) {
      return
    }

    this.keyDown[key] = false
    this.updateCameraMove()

    if (key === ' ') {
      if (this.supplyLinesEditModeActive) {
        this.endSupplyLinesEditMode()
      }
    }

    const tile = this.hoveredTile
    if (key === 'Shift' && tile && tile.action && tile.building?.army) {
      tile.action.endHover()
    }

    if (key === 'e' || key === 'q') {
      const zoomDirection = key === 'e' ? -1 : 1
      this.targetScale = this.calculateZoomScale(zoomDirection)
    }
  }

  handleMouseDown(event: MouseEvent) {
    if (
      this.status !== 'running' ||
      !this.cursor ||
      !this.camera ||
      this.player?.surrendered
    ) {
      return
    }

    // Start sounds
    if (!SoundManager.initialized) {
      SoundManager.init()
    }

    const { clientX: x, clientY: y } = event
    const { hoveredTile } = this

    this.clickedAt = Date.now()

    // Left mouse button
    if (event.button === 0 && !this.keyDown['Shift']) {
      if (
        !ArmyDragManager.active &&
        hoveredTile &&
        hoveredTile.isOwnedByThisPlayer() &&
        hoveredTile.building
      ) {
        // Activate Army Drag Manager
        if (hoveredTile.building?.army || this.supplyLinesEditModeActive) {
          ArmyDragManager.startDrag(hoveredTile.building)
          return
        }
      }

      if (!ArmyDragArrow)
        if (
          this.supplyLinesEditModeActive &&
          this.hoveredTile &&
          this.hoveredTile.building
        ) {
          // Destroy Supply Line
          const supplyLine = this.getSupplyLineBySourceBuilding(
            this.hoveredTile.building
          )
          if (supplyLine && store.socket) {
            store.socket.send('destroySupplyLine', supplyLine.id)
            return
          }
        }
    }

    if (!this.keyDown['Shift']) {
      this.cameraDrag = {
        cursor: { x, y },
        camera: {
          x: this.camera.x,
          y: this.camera.y,
        },
      }
    }
  }

  handleMouseUp(event: MouseEvent) {
    if (!this.cursor || !store.socket) return

    const { hoveredTile } = this

    let cursorDelta: number = 0
    if (this.cameraDrag) {
      cursorDelta =
        Math.abs(this.cursor.x - this.cameraDrag.cursor.x) +
        Math.abs(this.cursor.y - this.cameraDrag.cursor.y)
      this.cameraDrag = null
    }

    let timeDelta: number = 0
    if (this.clickedAt) {
      timeDelta = Date.now() - this.clickedAt
    }

    // Clear dragged
    const dragged = this.dragged
    this.dragged = false

    // Unselect army
    if (!hoveredTile) {
      if (ArmyDragManager.active) {
        ArmyDragManager.deactivate()
      }
      return
    }

    // Army Send Manager
    if (event.button === 0 && ArmyDragManager.active) {
      if (
        ArmyDragManager.tile === hoveredTile ||
        ArmyDragManager.direction === null
      ) {
        if (
          this.supplyLinesEditModeActive &&
          ArmyDragManager.tile &&
          ArmyDragManager.tile.building
        ) {
          const supplyLine = this.getSupplyLineBySourceBuilding(
            ArmyDragManager.tile.building
          )
          if (supplyLine) {
            store.socket.send('destroySupplyLine', supplyLine.id)
          }
        }

        ArmyDragManager.deactivate()
      } else {
        if (ArmyDragManager.army) {
          ArmyDragManager.sendArmy()
        } else if (ArmyDragManager.targetBuilding) {
          ArmyDragManager.createSupplyLine()
        } else {
          ArmyDragManager.deactivate()
        }
      }
    }

    // Standard click
    else if (
      (event.button === 0 || this.keyDown['Shift']) &&
      cursorDelta < 32 &&
      timeDelta < MAX_CLICK_DURATION
    ) {
      if (dragged || this.supplyLinesEditModeActive) {
        return
      }

      // Toggle Action's automation
      if (
        hoveredTile.action &&
        hoveredTile.action.type === 'RECRUIT_ARMY' &&
        (hoveredTile.action.status === 'RUNNING' ||
          hoveredTile.action.status === 'QUEUED' ||
          hoveredTile.action.status === 'PAUSED')
      ) {
        hoveredTile.action.toggleAutomated()
        return
      }

      // Create Action
      const actionType = hoveredTile.getActionType()
      if (!actionType) {
        this.showNotEnoughGold(hoveredTile)
        return
      }
      if (hoveredTile.action && hoveredTile.action.status === 'PREVIEW') {
        hoveredTile.action.confirm()
        return
      }
    }
  }

  handleMouseMove({ clientX: x, clientY: y }: MouseEvent) {
    this.setCursor({ x, y })

    if (this.cameraDrag) {
      const cursorDeltaX = Math.abs(x - this.cameraDrag.cursor.x)
      const cursorDeltaY = Math.abs(y - this.cameraDrag.cursor.y)
      if (cursorDeltaX + cursorDeltaY > 32) {
        this.dragged = true
      }
    }
  }

  handleWheelMove({ deltaY, detail }: WheelEvent) {
    if (!this.player?.alive && !isSpectating()) return

    // Start sounds
    if (!SoundManager.initialized) {
      SoundManager.init()
    }

    const delta = deltaY || detail
    const zoomDirection = (delta < 0 ? -1 : 1) * -1

    this.targetScale = this.calculateZoomScale(zoomDirection)
  }

  handleContextMenu(event: Event) {
    event.preventDefault()
  }

  updateBorders() {
    const tiles = Array.from(this.tiles)
    for (let i = tiles.length - 1; i >= 0; i--) {
      tiles[i][1].updateBorders()
    }
  }

  getHoveredTile() {
    if (!this.cursor || !this.camera) return null

    const pixel = {
      x: this.cursor.x - this.camera.x,
      y: this.cursor.y - this.camera.y,
    }

    const axial = pixelToAxial(pixel)

    return getTileByAxial(axial)
  }

  setCameraToAxial(axial: Axial, xOffset: number = 0) {
    if (!this.pixi) return

    const { innerWidth, innerHeight } = window
    const pixel = getPixelPosition(axial)
    this.camera = {
      x: (innerWidth - xOffset) / 2 - pixel.x * this.scale,
      y: innerHeight / 2 - pixel.y * this.scale,
    }

    this.updateStageScale()
    this.updateStagePosition()
  }

  updateCameraMove() {
    this.cameraMove = { x: 0, y: 0 }

    // if (this.keyDown['d']) {
    //   this.cameraMove.x--
    // }

    // if (this.keyDown['a']) {
    //   this.cameraMove.x++
    // }

    // if (this.keyDown['s']) {
    //   this.cameraMove.y--
    // }

    // if (this.keyDown['w']) {
    //   this.cameraMove.y++
    // }
  }

  createRequest(receiverId: string) {
    if (store.socket) {
      store.socket.send('request', `create|${receiverId}`)
    }
  }

  updateHoveredTile() {
    const newHoveredTile = this.getHoveredTile()
    let changed = false

    // existing -> non-existing
    if (this.hoveredTile && !newHoveredTile) {
      this.hoveredTile.endHover()
      this.hoveredTile = null
      changed = true
    }

    // non-existing -> existing
    if (!this.hoveredTile && newHoveredTile) {
      this.hoveredTile = newHoveredTile
      newHoveredTile.startHover()
      changed = true
    }

    // existing[A] -> existing[B]
    if (
      this.hoveredTile &&
      newHoveredTile &&
      this.hoveredTile.id !== newHoveredTile.id
    ) {
      this.hoveredTile.endHover()
      this.hoveredTile = newHoveredTile
      this.hoveredTile.startHover()
      changed = true
    }

    if (changed) {
      // this.updatePatternPreviews()

      if (ArmyDragManager.active) {
        ArmyDragManager.onHoveredTileChange(this.hoveredTile)
      }
    }
  }

  surrender() {
    if (store.socket) {
      store.socket.send('surrender')
    }
  }

  updateStageScale() {
    if (!this.pixi) return

    this.pixi.stage.scale.x = this.scale
    this.pixi.stage.scale.y = this.scale
  }

  updateStagePosition() {
    if (!this.pixi || !this.camera) return

    this.pixi.stage.x = this.camera.x
    this.pixi.stage.y = this.camera.y
  }

  calculateZoomScale(zoomDirection: number) {
    const scale = this.scale + zoomDirection * this.scale * ZOOM_SPEED
    const roundedScale = roundToDecimals(scale, 2)

    if (roundedScale >= MIN_SCALE && roundedScale <= MAX_SCALE) {
      return roundedScale
    }
    return this.scale
  }

  showNotEnoughGold(tile: Tile) {
    if (!this.player || !store.gsConfig) return

    const {
      RECRUIT_ARMY_COST,
      BUILD_CAMP_COST,
      BUILD_TOWER_COST,
      BUILD_CASTLE_COST,
      REBUILD_VILLAGE_COST,
    } = store.gsConfig

    const actionType = tile.getActionType({ ignoreGold: true })
    if (
      !actionType ||
      (actionType === 'BUILD_TOWER' && this.player.gold >= BUILD_TOWER_COST) ||
      (actionType === 'BUILD_CAMP' && this.player.gold >= BUILD_CAMP_COST) ||
      (actionType === 'BUILD_CASTLE' &&
        this.player.gold >= BUILD_CASTLE_COST) ||
      (actionType === 'RECRUIT_ARMY' &&
        this.player.gold >= RECRUIT_ARMY_COST) ||
      (actionType === 'REBUILD_VILLAGE' &&
        this.player.gold >= REBUILD_VILLAGE_COST)
    ) {
      return
    }

    this.notification = `${Date.now()}|Not enough gold`
    SoundManager.play('ACTION_FAILURE')
  }

  createSupplyLine(sourceTile: Tile, targetTile: Tile) {
    const supplyLine = new SupplyLine(uuid(), sourceTile, targetTile)

    if (store.socket) {
      store.socket.send(
        'createSupplyLine',
        `${supplyLine.id}|${sourceTile.id}|${targetTile.id}`
      )
    }
  }

  startSupplyLinesEditMode() {
    this.supplyLinesEditModeActive = true

    if (this.hoveredTile) {
      // Destroy preview Action
      if (
        this.hoveredTile.action &&
        this.hoveredTile.action.status === 'PREVIEW'
      ) {
        this.hoveredTile.action.destroy()
      }

      // Highlight Building Tile
      if (this.hoveredTile.building && this.hoveredTile.isOwnedByThisPlayer()) {
        this.hoveredTile.building.showHighlight()
      }
    }
  }

  endSupplyLinesEditMode() {
    this.supplyLinesEditModeActive = false

    if (this.hoveredTile) {
      this.hoveredTile.showActionPreviewIfPossible()

      if (this.hoveredTile.building && !this.hoveredTile.building.army) {
        this.hoveredTile.building.hideHighlight()
      }
    }

    if (ArmyDragManager.active && !ArmyDragManager.army) {
      ArmyDragManager.deactivate()
    }
  }

  getSupplyLineBySourceBuilding(sourceBuilding: Building): SupplyLine | null {
    const supplyLines = Array.from(this.supplyLines.values())
    for (let i = 0; i < supplyLines.length; i++) {
      const supplyLine = supplyLines[i]
      if (supplyLine.sourceTile.building === sourceBuilding) {
        return supplyLine
      }
    }

    return null
  }
}

export default Game
