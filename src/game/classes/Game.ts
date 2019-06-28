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
import canAttack from '../functions/canAttack'
import getHoveredTileInfo from '../functions/getHoveredTileInfo'
import getTileByAxial from '../functions/getTileByAxial'
import Tile from './Tile'
import { Ticker, Application, Container } from 'pixi.js'
import showSurrenderButton from '../functions/showSurrenderButton'

class Game {
  scale: number = DEFAULT_SCALE
  targetScale: number = DEFAULT_SCALE
  selectedArmyTile: Tile | null = null
  loop: Ticker | null = null
  pixi: Application | null = null
  readonly stage: { [key: string]: Container } = {}
  initialized: boolean = false
  private pingArray: number[] = []
  private fpsArray: number[] = []
  readonly animations: Array<Animation | GoldAnimation> = []
  camera: Pixel | null = null
  cameraMove: Pixel = { x: 0, y: 0 }
  cameraDrag: {
    camera: Pixel
    cursor: Pixel
  } | null = null
  cursor: Pixel | null = null
  selectedArmyTargetTiles: Tile[][] = []
  tilesWithPatternPreview: Tile[] = []
  predictedActionTile: Tile | null = null
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
  } | null = null

  constructor() {
    // Leaving warning
    window.onbeforeunload = () => {
      if (
        !showSurrenderButton(store.players, store.player) &&
        !store.error &&
        store.player &&
        store.player.alive &&
        store.status === 'running' &&
        store.gsConfig &&
        !store.gsConfig.DEBUG_MODE
      ) {
        return true
      }
    }

    // Listeners and Images
    this.setupEventListeners()
    this.setupStoreListeners()

    // Add debug global variables
    ;(window as any).g = this
    ;(window as any).s = store
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

    store._game = null
  }
  update() {
    if (!store.actions || !store.armies || !this.camera || !this.pixi) return

    const now = Date.now()
    const fraction = 16.66 / (now - this.lastUpdatedAt)
    this.lastUpdatedAt = now
    this.fpsArray.push(Math.round(fraction * 60))
    if (this.fpsArray.length > 20) {
      this.fpsArray.shift()
    }

    if (now - this.fpsLastUpdatedAt > 2000) {
      const sum = this.fpsArray.reduce((item, acc) => acc + item, 0)
      store.fps = Math.round(sum / this.fpsArray.length)
      this.fpsLastUpdatedAt = now
    }

    // if (
    //   store.player &&
    //   store.player.alive &&
    //   store.gameTime &&
    //   store.timeFromActivity - store.gameTime > 60
    // ) {
    //   this.surrender()
    //   return
    // }

    if (this.animations.length > 0) {
      // Animations
      for (let i = this.animations.length - 1; i >= 0; i--) {
        this.animations[i].update()

        if (this.animations[i].finished) {
          this.animations.splice(i, 1)
        }
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
    if (store.status === 'running') {
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
    for (let i = 0; i < store.actions.length; i++) {
      store.actions[i].update()
    }

    // Armies
    for (let i = 0; i < store.armies.length; i++) {
      store.armies[i].update()
    }

    // Hovered tile
    this.updateHoveredTile()
  }
  spectate() {
    if (store.gameIndex === null) return

    Socket.send('spectate', String(store.gameIndex))
  }
  stopSpectate() {
    Socket.send('stopSpectate', String(store.gameIndex))
    store.spectating = false
    store.gameIndex = null
  }
  setupStoreListeners() {
    store.onChange('tiles', () => {
      if (!this.camera && store.spawnTile) {
        this.setCameraToAxialPosition(store.spawnTile.axial)
      }

      this.updateBlackOverlays()
      this.updateBorders()
      this.updateHoveredTileInfo()
      this.updatePatternPreviews()
    })

    store.onChange('actions', () => {
      this.updatePatternPreviews()
    })

    store.onChange('serverTime', () => {
      if (store.serverTime) {
        this.pingArray.push(Date.now() - store.serverTime)

        if (this.pingArray.length > 20) {
          this.pingArray.shift()
        }

        const sum = this.pingArray.reduce((item, acc) => acc + item, 0)
        store.ping = Math.round(sum / this.pingArray.length)
      }
    })

    store.onChange('goldAnimation', () => {
      const { goldAnimation } = store

      if (!goldAnimation) return

      const tile = store.getTile(goldAnimation.tileId)

      if (!tile) return

      new GoldAnimation(tile, goldAnimation.count)
    })
  }
  setupEventListeners() {
    this.eventListeners = {
      mousemove: this.handleMouseMove.bind(this),
      mousedown: this.handleMouseDown.bind(this),
      mouseup: this.handleMouseUp.bind(this),
      keydown: this.handleKeyDown.bind(this),
      keyup: this.handleKeyUp.bind(this),
      wheel: this.handleWheelMove.bind(this),
    }

    document.addEventListener('mousemove', this.eventListeners.mousemove)
    document.addEventListener('mousedown', this.eventListeners.mousedown)
    document.addEventListener('mouseup', this.eventListeners.mouseup)
    document.addEventListener('keydown', this.eventListeners.keydown)
    document.addEventListener('keyup', this.eventListeners.keyup)
    document.addEventListener('contextmenu', this.handleContextMenu, false)
    document.addEventListener('wheel', this.eventListeners.wheel)
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
  }
  updateScreenSize() {
    if (!this.pixi) return

    this.pixi.renderer.resize(window.innerWidth, window.innerHeight)
  }
  selectPattern = (pattern: string) => {
    Socket.send('pattern', pattern)
  }
  handleKeyDown({ key }: KeyboardEvent) {
    if (store.status !== 'running' || (store.spectating && store.chatFocus)) {
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

    const tile = store.hoveredTile
    const command = getDebugCommand(key)

    if (!tile || !command) return

    Socket.send('debug', `${command}|${tile.axial.x}|${tile.axial.z}`)
  }
  handleKeyUp({ key }: KeyboardEvent) {
    if (
      store.status !== 'running' ||
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

    if (key === 'h' && store.gsConfig.DEBUG_MODE) {
      store.showHud = !store.showHud
    }
  }
  handleMouseDown(event: MouseEvent) {
    if (store.status !== 'running' || !this.cursor || !this.camera) return

    const { clientX: x, clientY: y, button } = event
    const { hoveredTile } = store

    // Army - select
    if (
      !this.selectedArmyTile &&
      hoveredTile &&
      hoveredTile.ownerId === store.playerId &&
      hoveredTile.army &&
      hoveredTile.army.ownerId === store.playerId &&
      hoveredTile.building &&
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

    const { hoveredTile, playerId } = store

    let cursorDelta: number | null = null
    if (this.cameraDrag) {
      cursorDelta =
        Math.abs(this.cursor.x - this.cameraDrag.cursor.x) +
        Math.abs(this.cursor.y - this.cameraDrag.cursor.y)
      this.cameraDrag = null
    }

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

      if (button) {
        Socket.send(
          'click',
          `${hoveredTile.axial.x}|${hoveredTile.axial.z}|${button}`
        )

        if (canAttack(hoveredTile)) {
          this.predictedActionTile = hoveredTile

          setTimeout(
            (() => {
              if (this.predictedActionTile === hoveredTile) {
                this.predictedActionTile = null
              }
            }).bind(this),
            500
          )
        }
      }
    }

    // Army - drag & drop send
    else if (this.selectedArmyTile && this.selectedArmyTile !== hoveredTile) {
      this.sendArmy(hoveredTile)
      return
    }
  }
  handleMouseMove({ clientX: x, clientY: y }: MouseEvent) {
    store.timeFromActivity = store.gameTime ? store.gameTime : 0

    this.cursor = { x, y }
  }
  handleWheelMove({ deltaY, detail }: WheelEvent) {
    const delta = deltaY || detail
    const zoomDirection = (delta < 0 ? -1 : 1) * -1

    this.targetScale = this.calculateZoomScale(zoomDirection)
  }
  handleContextMenu(event: Event) {
    event.preventDefault()
  }
  updateHoveredTileInfo() {
    if (!store.hoveredTile) return false

    const hoveredTileInfo = getHoveredTileInfo(store.hoveredTile)
    return !!hoveredTileInfo
  }
  updateBorders() {
    const keys = Object.keys(store.idMap.tiles)
    for (let i = keys.length - 1; i >= 0; i--) {
      store.idMap.tiles[keys[i]].updateBorders()
    }
  }
  updateContested() {
    // if (!store.tiles) return
    // for (let i = 0; i < store.tiles.length; i++) {
    //   const t = store.tiles[i]
    //   if (t === store.hoveredTile && t.isContested() && !t.owner) {
    //     t.addContested()
    //   } else {
    //     t.removeContested()
    //   }
    // }
  }
  getHoveredTile() {
    if (!this.cursor || !this.camera) return

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

    // Attack hover
    if (store.playerId === playerId && canAttack(tile)) {
      tilesToCapture.push(tile)
    }

    // Upgrade hover
    if (
      store.playerId === tile.ownerId &&
      tile.building &&
      tile.building.type === 'TOWER' &&
      tile.building.hp === store.gsConfig.HP.TOWER &&
      !this.selectedArmyTile
    ) {
      for (let i = 0; i < 6; i++) {
        const n = tile.neighbors[i]
        if (n && !tilesToCapture.includes(n) && !n.owner) {
          tilesToCapture.push(n)
        }
      }
    }

    // Actions (attack, upgrade)
    for (let i = 0; i < store.actions.length; i++) {
      const action = store.actions[i]

      if (
        action.type === 'attack' &&
        action.owner.id === playerId &&
        !tilesToCapture.includes(action.tile)
      ) {
        tilesToCapture.push(action.tile)
        continue
      }

      if (action.type === 'upgrade' && action.owner.id === playerId) {
        for (let j = 0; j < 6; j++) {
          const n = action.tile.neighbors[j]
          if (n && !tilesToCapture.includes(n) && !n.owner) {
            tilesToCapture.push(n)
          }
        }
      }
    }

    // Army sending
    if (store.player && playerId === store.playerId && this.selectedArmyTile) {
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

          // Owned Mountain
          if (
            t.mountain &&
            t.owner &&
            t.ownerId !== playerId &&
            t.ownerId !== store.player.allyId
          ) {
            break
          }

          // Owned Castle & Base
          if (t.ownerId === playerId && t.building) {
            break
          }

          // Ally tile
          if (t.ownerId && t.ownerId === store.player.allyId) {
            break
          }

          if (t.ownerId !== playerId && !t.bedrock) {
            tilesToCapture.push(t)

            if (t.camp || t.mountain || t.village || t.building) {
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
    if (store.player && store.player.allyId) {
      for (let i = tilesToCapture.length - 1; i >= 0; i--) {
        const t = tilesToCapture[i]
        if (t.owner && t.owner.id === store.player.allyId) {
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
    for (let i = 0; i < store.actions.length; i++) {
      const action = store.actions[i]

      if (action.type !== 'attack' && action.type !== 'upgrade') continue

      const tilesToCapture = this.getTilesToCapture(
        action.tile,
        action.owner.id
      )

      for (let j = 0; j < tilesToCapture.length; j++) {
        const t = tilesToCapture[j]

        if (this.tilesWithPatternPreview.includes(t)) continue

        this.tilesWithPatternPreview.push(t)

        for (let k = 0; k < store.players.length; k++) {
          if (store.players[k].id === action.owner.id) {
            pattern[`${t.axial.x}|${t.axial.z}`] = store.players[k].pattern
            break
          }
        }
      }
    }

    // Hovered tile
    if (store.hoveredTile && store.player) {
      const tilesToCapture = this.getTilesToCapture(
        store.hoveredTile,
        store.player.id
      )

      for (let i = 0; i < tilesToCapture.length; i++) {
        const t = tilesToCapture[i]

        if (this.tilesWithPatternPreview.includes(t)) continue

        this.tilesWithPatternPreview.push(t)

        pattern[`${t.axial.x}|${t.axial.z}`] = store.player.pattern
      }
    }

    // Predicted action tile
    if (this.predictedActionTile && store.player) {
      const tilesToCapture = this.getTilesToCapture(
        this.predictedActionTile,
        store.player.id
      )

      for (let i = 0; i < tilesToCapture.length; i++) {
        const t = tilesToCapture[i]

        if (this.tilesWithPatternPreview.includes(t)) continue

        this.tilesWithPatternPreview.push(t)

        pattern[`${t.axial.x}|${t.axial.z}`] = store.player.pattern
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
    const keys = Object.keys(store.idMap.tiles)
    for (let i = keys.length - 1; i >= 0; i--) {
      store.idMap.tiles[keys[i]].updateBlackOverlay()
    }
  }
  updateHoveredTile() {
    const newHoveredTile = this.getHoveredTile()

    // existing -> non-existing
    if (store.hoveredTile && !newHoveredTile) {
      store.hoveredTile.endHover()
      store.hoveredTile = null
    }

    // non-existing -> existing
    if (!store.hoveredTile && newHoveredTile) {
      store.hoveredTile = newHoveredTile
      newHoveredTile.startHover()

      this.updatePatternPreviews()

      if (this.selectedArmyTile) {
        this.updateArmyTileHighlights()
      } else {
        this.updateHoveredTileInfo()
        this.updateContested()
      }
    }

    // existing[A] -> existing[B]
    if (
      store.hoveredTile &&
      newHoveredTile &&
      store.hoveredTile.id !== newHoveredTile.id
    ) {
      store.hoveredTile.endHover()
      store.hoveredTile = newHoveredTile
      store.hoveredTile.startHover()

      this.updatePatternPreviews()

      if (this.selectedArmyTile) {
        this.updateArmyTileHighlights()
      } else {
        this.updateHoveredTileInfo()
        this.updateContested()
      }
    }
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

    if (!store.hoveredTile) return

    for (let i = 0; i < 6; i++) {
      if (this.selectedArmyTargetTiles[i].includes(store.hoveredTile)) {
        direction = i
        break
      }
    }

    if (direction !== null) {
      for (let i = 0; i < gsConfig.ARMY_RANGE; i++) {
        const t = this.selectedArmyTargetTiles[direction][i]

        if (!t || !t.owner || t.owner.id !== store.playerId) continue

        t.addHighlight()

        if (t.building) break
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
}

export default Game
