import GoldAnimation from './GoldAnimation'
import {
  DEFAULT_SCALE,
  TILE_IMAGES,
  ZOOM_SPEED,
  MIN_SCALE,
  MAX_SCALE,
  CAMERA_SPEED,
} from '../../constants/game'
import Socket from '../../websockets/Socket'
import createGameLoop from '../functions/createGameLoop'
import createPixiApp from '../functions/createPixiApp'
import store from '../../store'
import { Pixel, Axial } from '../../types/coordinates'
import { Animation } from '../functions/animate'
import pixelToAxial from '../functions/pixelToAxial'
import getPixelPosition from '../functions/pixelFromAxial'
import roundToDecimals from '../functions/roundToDecimals'
import getDebugCommand from '../functions/getDebugCommand'
import getTileByAxial from '../functions/getTileByAxial'
import Tile from './Tile'
import { Ticker, Application, Container } from 'pixi.js'
import Action from './Action'
import uuid = require('uuid/v4')
import { observable, computed } from 'mobx'
import AllianceRequest from './AllianceRequest'
import Army from './Army'
import Player from './Player'
import Forest from './Forest'
import Village from './Village'
import GameMode from '../../types/GameMode'
import HoveredTileInfo from '../../types/HoveredTileInfo'
import ArmyDragArrow from './ArmyDragArrow'
import SoundManager from '../../SoundManager'
import LocalStorageManager from '../../LocalStorageManager'
import Unit from './Army/Unit'
import GameStatus from '../../types/GameStatus'
import UnitPreviewManager from './UnitPreviewManager'

class Game {
  readonly id: string
  readonly mode: GameMode
  readonly stage: Map<string, Container> = new Map()
  @observable allianceRequests: Map<string, AllianceRequest> = new Map()
  @observable players: Map<string, Player> = new Map()
  @observable forests: Map<string, Forest> = new Map()
  @observable villages: Map<string, Village> = new Map()
  @observable tiles: Map<string, Tile> = new Map()
  @observable actions: Action[] = []
  @observable hoveredTile: Tile | null = null
  @observable startCountdown: number | null = null
  @observable incomeAt: number | null = null
  @observable lastIncomeAt: number | null = null
  @observable incomeStartedAt: number | null = null
  @observable goldAnimation: { tileId: string; count: number } | null = null
  @observable notification: string | null = null
  @observable flash: number | null = null
  @observable showHud: boolean = true
  @observable fps: number | null = 0
  @observable timeDiff: number = 0
  @observable status: GameStatus
  @observable time: number | null = null
  @observable playerId: string | null = null
  @observable spawnTile: Tile | null = null
  @observable cursor: Pixel | null = null
  @observable hoveredTileInfo: HoveredTileInfo | null = null
  @observable spectators: number | null = 0
  armies: Map<string, Army> = new Map()
  units: Unit[] = []
  productionTiles: Tile[] = []
  scale: number = DEFAULT_SCALE
  targetScale: number = DEFAULT_SCALE
  selectedArmyTile: Tile | null = null
  loop: Ticker | null = null
  pixi: Application | null = null
  initialized: boolean = false
  timeDiffs: number[] = []
  fpsArray: number[] = []
  readonly animations: Array<Animation | GoldAnimation> = []
  camera: Pixel | null = null
  cameraMove: Pixel = { x: 0, y: 0 }
  cameraDrag: {
    camera: Pixel
    cursor: Pixel
  } | null = null
  dragged: boolean = false
  selectedArmyTargetTiles: Tile[][] = []
  tilesWithPatternPreview: Tile[] = []
  readonly keyDown: { [key: string]: boolean } = {}
  private lastUpdatedAt: number = Date.now()
  private fpsLastUpdatedAt: number = Date.now()
  eventListeners: {
    mousemove: (event: any) => void
    mousedown: (event: any) => void
    mouseup: (event: any) => void
    keydown: (event: any) => void
    keyup: (event: any) => void
    wheel: (event: any) => void
    resize: (event: any) => void
  } | null = null
  changeHandlers: { [key: string]: () => void } = {}
  armyDragArrow: ArmyDragArrow | null = null

  // Computed getters
  @computed get player() {
    return this.playerId ? this.players.get(this.playerId) || null : null
  }
  @computed get gold() {
    return this.player ? this.player.gold : 0
  }

  constructor(id: string, mode: GameMode, status: GameStatus) {
    this.id = id
    this.mode = mode
    this.status = status

    // Leaving warning
    window.onbeforeunload = () => {
      if (
        !store.error &&
        this.player &&
        this.player.alive &&
        this.status === 'RUNNING' &&
        store.gsConfig &&
        !store.gsConfig.DEBUG_MODE
      ) {
        return true
      }
    }

    // Listeners and Images
    this.setupEventListeners()

    // Global debug reference
    ;(window as any).game = this
  }
  render(canvas: HTMLElement) {
    const tutorialFinished =
      !LocalStorageManager.supported ||
      LocalStorageManager.get('tutorialFinished') === 'true'

    if (!this.loop) {
      this.loop = createGameLoop(this.update, this)
      if (this.mode === 'TUTORIAL' && !tutorialFinished) {
        this.loop.stop()
      }
    }

    if (!this.pixi) {
      this.pixi = createPixiApp()
      for (let i = 0; i < TILE_IMAGES.length; i++) {
        const container = new Container()
        this.stage.set(TILE_IMAGES[i], container)
        this.pixi.stage.addChild(container)
      }

      this.pixi.view.id = this.id
    }

    canvas.appendChild(this.pixi.view)

    // Tutorial
    if (this.mode === 'TUTORIAL' && !tutorialFinished) {
      store.showGuide = true
    }
  }
  destroy() {
    for (let i = 0; i < TILE_IMAGES.length; i++) {
      const stage = this.stage.get(TILE_IMAGES[i])
      if (stage) {
        stage.removeChildren()
      }
    }

    if (this.pixi) {
      this.pixi.destroy()
      this.pixi = null
    }

    if (this.loop) {
      this.loop.destroy()
      this.loop = null
    }

    this.clearEventListeners()

    // Remove canvas element
    const canvas = document.getElementById(this.id)
    if (canvas) {
      canvas.remove()
    }

    if (store.game === this) {
      store.game = null
    }
  }
  update() {
    if (!this.camera || !this.pixi || !this.cursor) return

    const now = Date.now()
    const fraction = 16.66 / (now - this.lastUpdatedAt)
    this.lastUpdatedAt = now
    this.fpsArray.push(Math.round(fraction * 60))
    if (this.fpsArray.length > 20) {
      this.fpsArray.shift()
    }

    if (now - this.fpsLastUpdatedAt > 2000) {
      const sum = this.fpsArray.reduce((item, acc) => acc + item, 0)
      this.fps = Math.round(sum / this.fpsArray.length)
      this.fpsLastUpdatedAt = now
    }

    // Animations
    for (let i = this.animations.length - 1; i >= 0; i--) {
      this.animations[i].update()
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
        this.updateStagePosition()
      }
    }

    // Zoom
    if (this.status === 'RUNNING') {
      if (this.scale !== this.targetScale) {
        const step = roundToDecimals((this.targetScale - this.scale) / 5, 4)

        let newScale = this.scale
        if (step !== 0) {
          newScale += step
        } else {
          newScale = this.targetScale
        }

        const cameraOffset = this.calculateZoomOffset(this.scale, newScale)
        this.camera.x += cameraOffset.x
        this.camera.y += cameraOffset.y
        this.scale = newScale

        this.updateStageScale()
        this.updateStagePosition()
      }
    }

    // Actions
    for (let i = 0; i < this.actions.length; i++) {
      this.actions[i].update()
    }

    // Units
    for (let i = 0; i < this.units.length; i++) {
      if (this.units[i].fraction !== 1) {
        this.units[i].update()
      }
    }

    // Army drag arrow
    if (this.armyDragArrow) {
      this.armyDragArrow.update()
    }

    // Production tiles
    for (let i = 0; i < this.productionTiles.length; i++) {
      this.productionTiles[i].updateProduction()
    }

    // Hovered tile
    if (this.status === 'RUNNING') {
      this.updateHoveredTile()
    }

    // Income bar
    this.updateIncomeBar()
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
  selectPattern = (pattern: string) => {
    Socket.send('pattern', pattern)
  }
  handleKeyDown({ key }: KeyboardEvent) {
    if (this.status !== 'RUNNING' || (store.spectating && store.chatFocus)) {
      return
    }

    this.keyDown[key] = true

    if (key === 'Escape') {
      Socket.send('cancel')
      return
    }

    if (key === ' ') {
      const keys = this.stage.keys()
      let sum = 0
      console.log('')
      console.log('---- ----')
      for (const k of Array.from(keys)) {
        const stage = this.stage.get(k)
        if (stage) {
          const amount = stage.children.length
          console.log(`${k}: ${amount}`)
          sum += amount
        }
      }
      console.log('---- ----')
      console.log(`TOTAL: ${sum}`)
      console.log('---- ----')
      return
    }

    const tile = this.hoveredTile
    const command = getDebugCommand(key)

    if (!tile || !command) return

    Socket.send('debug', `${command}|${tile.axial.x}|${tile.axial.z}`)
  }
  handleKeyUp({ key }: KeyboardEvent) {
    if (
      this.status !== 'RUNNING' ||
      !store.gsConfig ||
      (store.spectating && store.chatFocus)
    ) {
      return
    }

    this.keyDown[key] = false

    if (key === 'e' || key === 'q') {
      const zoomDirection = key === 'e' ? -1 : 1
      this.targetScale = this.calculateZoomScale(zoomDirection)
    }
  }
  handleMouseDown(event: MouseEvent) {
    if (this.status !== 'RUNNING' || !this.cursor || !this.camera) return

    const { clientX: x, clientY: y, button } = event
    const { hoveredTile } = this

    // Army - select
    if (
      !this.selectedArmyTile &&
      hoveredTile &&
      hoveredTile.ownerId === this.playerId &&
      hoveredTile.army &&
      hoveredTile.army.ownerId === this.playerId &&
      (hoveredTile.building || hoveredTile.camp) &&
      button !== 2
    ) {
      this.selectArmy(hoveredTile)
      return
    }

    // Army - unselect
    if (
      this.selectedArmyTile &&
      hoveredTile === this.selectedArmyTile &&
      button !== 2
    ) {
      this.selectedArmyTile.unselectArmy()
      return
    }

    // Camera drag
    this.cameraDrag = {
      cursor: { x, y },
      camera: {
        x: this.camera.x,
        y: this.camera.y,
      },
    }
  }
  handleMouseUp(event: MouseEvent) {
    if (!this.cursor) return

    const { hoveredTile, playerId } = this

    let cursorDelta: number | null = null
    if (this.cameraDrag) {
      cursorDelta =
        Math.abs(this.cursor.x - this.cameraDrag.cursor.x) +
        Math.abs(this.cursor.y - this.cameraDrag.cursor.y)
      this.cameraDrag = null
    }

    // Clear dragged
    const dragged = this.dragged
    this.dragged = false

    let button = null
    switch (event.button) {
      case 0:
        button = 'left'
        break

      case 2:
        button = 'right'
        break

      default:
        button = 'left'
    }

    // Right mouse button
    if (button === 'right') return

    if (!hoveredTile) {
      if (this.selectedArmyTile) {
        this.selectedArmyTile.unselectArmy()
      }
      return
    }

    // Standard click
    if (cursorDelta !== null && cursorDelta < 32) {
      // Army - send
      if (this.selectedArmyTile && hoveredTile !== this.selectedArmyTile) {
        this.sendArmy(hoveredTile)
        return
      }

      // Army - select
      if (
        hoveredTile.ownerId === playerId &&
        hoveredTile.army &&
        hoveredTile.army.ownerId === playerId &&
        hoveredTile.building
      ) {
        this.selectArmy(hoveredTile)
        return
      }

      // Create action
      if (hoveredTile.bedrock) return

      if (button && !dragged && this.player) {
        const actionType = hoveredTile.getActionType()
        if (!actionType) {
          this.showNotEnoughGold(hoveredTile)
          return
        }

        const action = new Action(uuid(), actionType, hoveredTile, this.player)
        this.actions.push(action)

        const { x, z } = hoveredTile.axial
        Socket.send('action', `${action.id}|${x}|${z}|${actionType}`)
      }
    }

    // Army - drag & drop send
    else if (this.selectedArmyTile && this.selectedArmyTile !== hoveredTile) {
      this.sendArmy(hoveredTile)
      return
    }
  }
  handleMouseMove({ clientX: x, clientY: y }: MouseEvent) {
    this.cursor = { x, y }

    if (this.cameraDrag) {
      const cursorDeltaX = Math.abs(this.cursor.x - this.cameraDrag.cursor.x)
      const cursorDeltaY = Math.abs(this.cursor.y - this.cameraDrag.cursor.y)
      if (cursorDeltaX + cursorDeltaY > 32) {
        this.dragged = true
      }
    }
  }
  handleWheelMove({ deltaY, detail }: WheelEvent) {
    if (!this.camera) return

    const chat = document.getElementById('chat')
    if (chat && chat.matches(':hover')) return

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

    const axial = pixelToAxial({
      x: this.cursor.x - this.camera.x,
      y: this.cursor.y - this.camera.y,
    })

    return getTileByAxial(axial)
  }
  getTilesToCapture(tile: Tile, playerId: string) {
    if (!store.gsConfig) return []

    const tilesToCapture: Tile[] = []

    // Army sending
    if (this.player && playerId === this.playerId && this.selectedArmyTile) {
      let direction = null

      for (let i = 0; i < 6; i++) {
        if (this.selectedArmyTargetTiles[i].includes(tile)) {
          direction = i
          break
        }
      }

      if (direction !== null) {
        const targetTiles = this.selectedArmyTargetTiles[direction]
        const { army } = this.selectedArmyTile

        let steps = army ? army.unitCount : 0
        let currentTile = this.selectedArmyTile.neighbors[direction]
        while (steps > 0 && currentTile) {
          const t = currentTile
          if (!t || t.bedrock) break

          // Ally tile
          if (t.ownerId && t.ownerId === this.player.allyId) {
            break
          }

          // Forest/Mountain - enemy
          else if (
            (t.forest || t.mountain) &&
            t.ownerId !== playerId &&
            t.owner
          ) {
            break
          }

          // Structure - owned
          else if (t.ownerId === playerId && (t.building || t.camp)) {
            break
          }

          // Structure - enemy/neutral
          else if (t.ownerId !== playerId && !t.bedrock) {
            if (t.building || (t.camp && t.army) || (!t.owner && t.camp)) {
              tilesToCapture.push(t)
              break
            }
          }

          // Add to array
          if (t.ownerId !== playerId) {
            steps--
            tilesToCapture.push(t)

            // Village - enemy
            if (t.village) {
              steps++
            }
          }

          currentTile = t.neighbors[direction]
        }
      }
    }

    // Villages
    const villageTiles: Tile[] = []
    for (let i = tilesToCapture.length - 1; i >= 0; i--) {
      const t: Tile = tilesToCapture[i]

      if (t.village) {
        villageTiles.push(t)
      }
    }
    while (villageTiles.length > 0) {
      const t = villageTiles[0]
      for (let j = 0; j < 6; j++) {
        const n = t.neighbors[j]
        if (!n || n.bedrock || tilesToCapture.includes(n)) {
          continue
        }

        if (n.owner && n.building) {
          continue
        }

        if (n.camp && n.army && n.owner) {
          continue
        }

        if (n.ownerId !== playerId && n.ownerId === t.ownerId) {
          tilesToCapture.push(n)
          if (n.village) {
            villageTiles.push(n)
          }
        }
      }
      villageTiles.shift()
    }

    // Allied tiles
    if (this.player && this.player.allyId) {
      for (let i = tilesToCapture.length - 1; i >= 0; i--) {
        const t = tilesToCapture[i]
        if (t.owner && t.owner.id === this.player.allyId) {
          tilesToCapture.splice(i, 1)
        }
      }
    }

    return tilesToCapture
  }
  updatePatternPreviews() {
    const oldTilesWithPatternPreview = this.tilesWithPatternPreview
    const pattern: { [key: string]: string } = {}
    this.tilesWithPatternPreview = []

    // Hovered tile
    if (this.hoveredTile && this.player) {
      const tilesToCapture = this.getTilesToCapture(
        this.hoveredTile,
        this.player.id
      )

      for (let i = 0; i < tilesToCapture.length; i++) {
        const t = tilesToCapture[i]
        if (this.tilesWithPatternPreview.includes(t)) continue
        this.tilesWithPatternPreview.push(t)
        pattern[`${t.axial.x}|${t.axial.z}`] = this.player.pattern
      }
    }

    // Remove
    for (let i = 0; i < oldTilesWithPatternPreview.length; i++) {
      const t = oldTilesWithPatternPreview[i]
      if (!this.tilesWithPatternPreview.includes(t)) {
        t.removePatternPreview()
      }
    }

    // Add
    for (let i = 0; i < this.tilesWithPatternPreview.length; i++) {
      const t = this.tilesWithPatternPreview[i]
      if (!oldTilesWithPatternPreview.includes(t)) {
        t.addPatternPreview(pattern[`${t.axial.x}|${t.axial.z}`])
      }
    }

    this.updateBorders()
  }
  setCameraToAxialPosition(axial: Axial, xOffset: number = 0) {
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
  acceptRequest(senderId: string) {
    Socket.send('request', `accept|${senderId}`)
  }
  declineRequest(senderId: string) {
    Socket.send('request', `decline|${senderId}`)
  }
  createRequest(receiverId: string) {
    Socket.send('request', `create|${receiverId}`)
  }
  updateBlackOverlays() {
    const tiles = Array.from(this.tiles)
    for (let i = tiles.length - 1; i >= 0; i--) {
      tiles[i][1].updateBlackOverlay()
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
      this.updatePatternPreviews()

      if (this.selectedArmyTile) {
        const direction = this.armySendDirection(this.hoveredTile)
        UnitPreviewManager.setDirection(direction)
      }
    }
  }
  armySendDirection(tile: Tile | null) {
    if (!tile) return null

    for (let i = 0; i < 6; i++) {
      if (this.selectedArmyTargetTiles[i].includes(tile)) {
        return i
      }
    }

    return null
  }
  surrender() {
    Socket.send('surrender')
  }
  sendArmy(tile: Tile) {
    if (!this.selectedArmyTile) return

    let index = null
    for (let i = 0; i < 6; i++) {
      if (this.selectedArmyTargetTiles[i].includes(tile)) {
        index = i
        break
      }
    }

    if (index !== null) {
      const { x, z } = this.selectedArmyTile.axial
      Socket.send('sendArmy', `${x}|${z}|${index}`)
      SoundManager.play('ARMY_SEND')
      if (this.armyDragArrow) {
        this.armyDragArrow.destroy()
      }
    } else {
      this.selectedArmyTile.unselectArmy()
    }

    UnitPreviewManager.clear()
    UnitPreviewManager.setArmy(null)
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
  selectArmy(tile: Tile) {
    this.selectedArmyTile = tile
    tile.selectArmy()
    if (tile.army) {
      UnitPreviewManager.setArmy(tile.army)
    }

    this.updateArmyTargetTiles()
    this.armyDragArrow = new ArmyDragArrow(tile)
  }
  sendGoldToAlly() {
    Socket.send('sendGold')
  }
  calculateZoomScale(zoomDirection: number) {
    const scale = this.scale + zoomDirection * this.scale * ZOOM_SPEED
    const roundedScale = roundToDecimals(scale, 2)

    if (roundedScale < MIN_SCALE) {
      return MIN_SCALE
    } else if (roundedScale > MAX_SCALE) {
      return MAX_SCALE
    }

    return roundedScale
  }
  calculateZoomOffset(oldScale: number, newScale: number) {
    if (!this.cursor || !this.camera) return { x: 0, y: 0 }

    const oldScaledCursor = {
      x: (this.cursor.x - this.camera.x) * oldScale,
      y: (this.cursor.y - this.camera.y) * oldScale,
    }
    const newScaledCursor = {
      x: (this.cursor.x - this.camera.x) * newScale,
      y: (this.cursor.y - this.camera.y) * newScale,
    }
    const deltaScaledCursor = {
      x: oldScaledCursor.x - newScaledCursor.x,
      y: oldScaledCursor.y - newScaledCursor.y,
    }

    return {
      x: deltaScaledCursor.x / newScale,
      y: deltaScaledCursor.y / newScale,
    }
  }
  updateIncomeBar() {
    const BAR_WIDTH = 200
    const BAR_HEIGHT = 36

    const { incomeAt, incomeStartedAt } = this
    const element = document.getElementById('income-bar-fill')
    const canvas = element as HTMLCanvasElement | null

    if (!canvas) return

    const ctx = canvas.getContext('2d')

    if (!incomeAt || !incomeStartedAt || !ctx) return

    ctx.canvas.width = BAR_WIDTH
    ctx.canvas.height = BAR_HEIGHT

    ctx.clearRect(0, 0, BAR_WIDTH, BAR_HEIGHT)

    const now = Date.now() //- ping
    const total = incomeAt - incomeStartedAt
    const onePercent = total / 100
    const current = now - incomeStartedAt

    let fraction = roundToDecimals(current / onePercent / 100, 2)
    if (fraction < 0) {
      fraction = 0
    } else if (fraction > 1) {
      fraction = 1
    }

    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, BAR_WIDTH * fraction, BAR_HEIGHT)
  }
  showNotEnoughGold(tile: Tile) {
    if (!this.player || !store.gsConfig) return

    const { CAMP_COST, TOWER_COST, CASTLE_COST } = store.gsConfig

    const actionType = tile.getActionType(true)

    if (
      !actionType ||
      // (actionType === 'CAPTURE' && this.player.gold >= tile.captureCost()) ||
      (actionType === 'TOWER' && this.player.gold >= TOWER_COST) ||
      // (actionType === 'CAMP' && this.player.gold >= CAMP_COST) ||
      (actionType === 'CASTLE' && this.player.gold >= CASTLE_COST)
    ) {
      return
    }

    this.notification = `${Date.now()}|Not enough gold`
  }
  updateArmyTargetTiles() {
    if (!store.game || !this.selectedArmyTile || !this.selectedArmyTile.army) {
      return
    }

    const armyTargetTiles: Tile[][] = []
    for (let i = 0; i < 6; i++) {
      armyTargetTiles[i] = []

      const nextTile = this.selectedArmyTile.neighbors[i]
      if (nextTile) {
        armyTargetTiles[i].push(nextTile)
      }

      let lastTile = armyTargetTiles[i][armyTargetTiles[i].length - 1]
      let steps = this.selectedArmyTile.army.unitCount
      while (steps > 0) {
        const nextTile = lastTile.neighbors[i]
        if (!nextTile) break

        lastTile = nextTile
        armyTargetTiles[i].push(nextTile)

        if (nextTile.ownerId !== store.game.playerId) {
          steps--
        }
      }
    }

    this.selectedArmyTargetTiles = armyTargetTiles
  }
}

export default Game
