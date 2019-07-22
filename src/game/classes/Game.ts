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
import Animation from './Animation'
import pixelToAxial from '../functions/pixelToAxial'
import getPixelPosition from '../functions/getPixelPosition'
import roundToDecimals from '../functions/roundToDecimals'
import getDebugCommand from '../functions/getDebugCommand'
import getHoveredTileInfo from '../functions/getHoveredTileInfo'
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

class Game {
  readonly id: string
  readonly stage: { [key: string]: Container } = {}
  @observable actions: Action[] = []
  @observable allianceRequests: { [key: string]: AllianceRequest } = {}
  @observable armies: { [key: string]: Army } = {}
  @observable players: { [key: string]: Player } = {}
  @observable forests: { [key: string]: Forest } = {}
  @observable villages: { [key: string]: Village } = {}
  @observable tiles: { [key: string]: Tile } = {}
  @observable hoveredTile: Tile | null = null
  @observable startCountdown: number | null = null
  @observable incomeAt: number | null = null
  @observable lastIncomeAt: number | null = null
  @observable incomeStartedAt: number | null = null
  @observable serverTime: number | null = null
  @observable goldAnimation: { tileId: string; count: number } | null = null
  @observable notification: string | null = null
  @observable flash: number | null = null
  @observable showHud: boolean = true
  @observable fps: number | null = 0
  @observable ping: number | null = 0
  @observable status:
    | 'starting'
    | 'running'
    | 'finished'
    | 'aborted'
    | null = null
  @observable time: number | null = null
  @observable playerId: string | null = null
  @observable mode: GameMode | null = null
  @observable spawnTile: Tile | null = null
  @observable cursor: Pixel | null = null
  @observable hoveredTileInfo: HoveredTileInfo | null = null // move this to react layer
  scale: number = DEFAULT_SCALE
  targetScale: number = DEFAULT_SCALE
  selectedArmyTile: Tile | null = null
  loop: Ticker | null = null
  pixi: Application | null = null
  initialized: boolean = false
  pingArray: number[] = []
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

  // Computed getters
  @computed get player() {
    return this.playerId ? this.players[this.playerId] || null : null
  }
  @computed get gold() {
    return this.player ? this.player.gold : 0
  }
  @computed get totalEconomy() {
    let totalEconomy = 0
    const keys = Object.keys(this.players)
    for (let i = 0; i < keys.length; i++) {
      totalEconomy += this.players[keys[i]].houses
    }
    return totalEconomy
  }

  constructor(id: string) {
    this.id = id

    // Leaving warning
    window.onbeforeunload = () => {
      if (
        !store.error &&
        this.player &&
        this.player.alive &&
        this.status === 'running' &&
        store.gsConfig &&
        !store.gsConfig.DEBUG_MODE
      ) {
        return true
      }
    }

    // Listeners and Images
    this.setupEventListeners()
    // this.setupStoreListeners()

    // Global debug references
    ;(window as any).game = this
    ;(window as any).store = store
  }
  render(canvas: HTMLElement) {
    this.loop = createGameLoop(this.update, this)
    this.pixi = createPixiApp()

    for (let i = 0; i < TILE_IMAGES.length; i++) {
      this.stage[TILE_IMAGES[i]] = new Container()
      this.pixi.stage.addChild(this.stage[TILE_IMAGES[i]])
    }

    canvas.appendChild(this.pixi.view)
  }
  destroy() {
    for (let i = 0; i < TILE_IMAGES.length; i++) {
      this.stage[TILE_IMAGES[i]].removeChildren()
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
    const canvasContainer = document.getElementById('game-canvas')
    if (canvasContainer) {
      const canvas = canvasContainer.firstChild
      if (canvas) {
        canvasContainer.removeChild(canvas)
      }
    }

    if (store.game === this) {
      store.game = null
    }
  }
  update() {
    if (!this.camera || !this.pixi) return

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
        this.setCameraToAxialPosition(axial)
      }
    }

    // Actions
    for (let i = 0; i < this.actions.length; i++) {
      this.actions[i].update()
    }

    // Armies
    const armies = Object.values(this.armies)
    for (let i = 0; i < armies.length; i++) {
      armies[i].update()
    }

    // Hovered tile
    this.updateHoveredTile()

    // Income bar
    this.updateIncomeBar()
  }
  spectate(gameId: string) {
    // Socket.send('spectate', gameId)
    // store.spectating = true
    // this.targetScale = MIN_SCALE
  }
  stopSpectate() {
    // Socket.send('stopSpectate')
    // store.gameIndex = null
    // store.spectating = false
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
    if (this.status !== 'running' || (store.spectating && store.chatFocus)) {
      return
    }

    this.keyDown[key] = true
    this.updateCameraMove()

    if (key === 'Escape') {
      Socket.send('cancel')
      return
    }

    if (key === ' ') {
      const keys = Object.keys(this.stage)
      let sum = 0
      console.log('')
      console.log('---- ----')
      for (const k of keys) {
        const amount = this.stage[k].children.length
        console.log(`${k}: ${amount}`)
        sum += amount
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
      this.status !== 'running' ||
      !store.gsConfig ||
      (store.spectating && store.chatFocus)
    ) {
      return
    }

    this.keyDown[key] = false
    this.updateCameraMove()

    if (key === 'e' || key === 'q') {
      const zoomDirection = key === 'e' ? -1 : 1
      this.targetScale = this.calculateZoomScale(zoomDirection)
    }
  }
  handleMouseDown(event: MouseEvent) {
    if (this.status !== 'running' || !this.cursor || !this.camera) return

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
      this.unselectArmy()
      return
    }

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
        this.unselectArmy()
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
    const delta = deltaY || detail
    const zoomDirection = (delta < 0 ? -1 : 1) * -1

    this.targetScale = this.calculateZoomScale(zoomDirection)
  }
  handleContextMenu(event: Event) {
    event.preventDefault()
  }
  updateBorders() {
    const keys = Object.keys(this.tiles)
    for (let i = keys.length - 1; i >= 0; i--) {
      this.tiles[keys[i]].updateBorders()
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
  getTilesToCapture(tile: Tile, playerId: string) {
    if (!store.gsConfig) return []

    const tilesToCapture = []
    const actionType = tile.getActionType()

    // Attack hover
    if (this.playerId === playerId && actionType === 'ATTACK') {
      tilesToCapture.push(tile)
    }

    // Upgrade hover
    if (actionType === 'CASTLE' && !this.selectedArmyTile && !tile.army) {
      for (let i = 0; i < 6; i++) {
        const n = tile.neighbors[i]
        if (n && !tilesToCapture.includes(n) && !n.owner) {
          tilesToCapture.push(n)
        }
      }
    }

    // Actions (ATTACK, CASTLE)
    for (let i = 0; i < this.actions.length; i++) {
      const action = this.actions[i]

      if (
        action.type === 'ATTACK' &&
        action.owner.id === playerId &&
        !tilesToCapture.includes(action.tile)
      ) {
        tilesToCapture.push(action.tile)
        continue
      }

      if (action.type === 'CASTLE' && action.owner.id === playerId) {
        for (let j = 0; j < 6; j++) {
          const n = action.tile.neighbors[j]
          if (n && !tilesToCapture.includes(n) && !n.owner) {
            tilesToCapture.push(n)
          }
        }
      }
    }

    // Army sending
    if (
      this.player &&
      playerId === this.playerId &&
      this.selectedArmyTile &&
      (!tile.action || tile.action.type !== 'ATTACK')
    ) {
      let direction = null

      for (let i = 0; i < 6; i++) {
        if (this.selectedArmyTargetTiles[i].includes(tile)) {
          direction = i
          break
        }
      }

      if (direction !== null) {
        for (let i = 0; i < store.gsConfig.ARMY_RANGE; i++) {
          const t = this.selectedArmyTargetTiles[direction][i]

          if (!t) continue

          // Enemy Mountain
          if (
            t.mountain &&
            t.owner &&
            t.ownerId !== playerId &&
            t.ownerId !== this.player.allyId
          ) {
            break
          }

          // Owned Castle & Base
          if (t.ownerId === playerId && t.building) {
            break
          }

          // Owned empty Camp
          if (t.ownerId === playerId && t.camp) {
            break
          }

          // Ally tile
          if (t.ownerId && t.ownerId === this.player.allyId) {
            break
          }

          // Enemy structure
          if (t.ownerId !== playerId && !t.bedrock) {
            tilesToCapture.push(t)
            if (t.mountain || t.forest || t.building || (t.camp && t.army)) {
              break
            }
          }
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

    // Actions
    for (let i = 0; i < this.actions.length; i++) {
      const action = this.actions[i]

      if (action.type !== 'ATTACK' && action.type !== 'CASTLE') continue

      const tilesToCapture = this.getTilesToCapture(
        action.tile,
        action.owner.id
      )

      for (let j = 0; j < tilesToCapture.length; j++) {
        const t = tilesToCapture[j]

        if (this.tilesWithPatternPreview.includes(t)) continue

        this.tilesWithPatternPreview.push(t)

        const players = Object.values(this.players)
        for (let k = 0; k < players.length; k++) {
          if (players[k].id === action.owner.id) {
            pattern[`${t.axial.x}|${t.axial.z}`] = players[k].pattern
            break
          }
        }
      }
    }

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

    for (let i = 0; i < oldTilesWithPatternPreview.length; i++) {
      const t = oldTilesWithPatternPreview[i]
      if (!this.tilesWithPatternPreview.includes(t)) {
        t.removePatternPreview()
      }
    }

    for (let i = 0; i < this.tilesWithPatternPreview.length; i++) {
      const t = this.tilesWithPatternPreview[i]
      if (!oldTilesWithPatternPreview.includes(t)) {
        t.addPatternPreview(pattern[`${t.axial.x}|${t.axial.z}`])
      }
    }

    this.updateBorders()
  }
  setCameraToAxialPosition(axial: Axial) {
    if (!this.pixi) return

    const { innerWidth, innerHeight } = window
    const pixel = getPixelPosition(axial)
    this.camera = {
      x: innerWidth / 2 - pixel.x * this.scale,
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
    const keys = Object.keys(this.tiles)
    for (let i = keys.length - 1; i >= 0; i--) {
      this.tiles[keys[i]].updateBlackOverlay()
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
      this.updateHoveredTileInfo()

      if (this.selectedArmyTile) {
        this.updateArmyTileHighlights()
      }
    }
  }
  updateHoveredTileInfo() {
    this.hoveredTileInfo = this.hoveredTile
      ? getHoveredTileInfo(this.hoveredTile)
      : null
  }
  updateArmyTileHighlights() {
    const { gsConfig } = store
    if (!gsConfig) return

    let direction = null

    for (let i = 0; i < 6; i++) {
      const armyTiles = this.selectedArmyTargetTiles[i]

      for (let j = 0; j < armyTiles.length; j++) {
        armyTiles[j].removeHighlight()
      }
    }

    if (!this.hoveredTile) return

    for (let i = 0; i < 6; i++) {
      if (this.selectedArmyTargetTiles[i].includes(this.hoveredTile)) {
        direction = i
        break
      }
    }

    if (direction !== null) {
      for (let i = 0; i < gsConfig.ARMY_RANGE; i++) {
        const t = this.selectedArmyTargetTiles[direction][i]

        if (!t || !t.owner || t.owner.id !== this.playerId) continue

        t.addHighlight()

        if (t.building || t.camp) break
      }
    }
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
    }

    this.updateArmyTileHighlights()
    this.selectedArmyTile.unselectArmy()
    this.selectedArmyTile = null

    for (let i = 0; i < 6; i++) {
      const armyTiles = this.selectedArmyTargetTiles[i]

      for (let j = 0; j < armyTiles.length; j++) {
        armyTiles[j].removeHighlight()
      }
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
  selectArmy(tile: Tile) {
    this.selectedArmyTile = tile
    tile.selectArmy()
  }
  unselectArmy() {
    if (!this.selectedArmyTile) return

    this.selectedArmyTile.unselectArmy()
    this.selectedArmyTile = null
  }
  sendGoldToAlly() {
    Socket.send('sendGold')
  }
  calculateZoomScale(zoomDirection: number) {
    const scale = this.scale + zoomDirection * this.scale * ZOOM_SPEED
    const roundedScale = roundToDecimals(scale, 2)

    if (roundedScale >= MIN_SCALE && roundedScale <= MAX_SCALE) {
      return roundedScale
    }
    return this.scale
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

    const {
      ATTACK_COST,
      RECRUIT_COST,
      CAMP_COST,
      TOWER_COST,
      CASTLE_COST,
    } = store.gsConfig

    const actionType = tile.getActionType(true)

    if (
      !actionType ||
      (actionType === 'ATTACK' && this.player.gold >= ATTACK_COST) ||
      (actionType === 'TOWER' && this.player.gold >= TOWER_COST) ||
      (actionType === 'CAMP' && this.player.gold >= CAMP_COST) ||
      (actionType === 'CASTLE' && this.player.gold >= CASTLE_COST) ||
      (actionType === 'RECRUIT' && this.player.gold >= RECRUIT_COST)
    ) {
      return
    }

    this.notification = `${Date.now()}|Not enough gold`
  }
}

export default Game
