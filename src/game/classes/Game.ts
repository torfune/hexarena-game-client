import GoldAnimation from './GoldAnimation'
import {
  DEFAULT_SCALE,
  TILE_IMAGES,
  ZOOM_SPEED,
  MIN_SCALE,
  MAX_SCALE,
} from '../../constants/game'
import Socket from '../../websockets/Socket'
import createGameLoop from '../functions/createGameLoop'
import loadImages from '../functions/loadImages'
import createPixiApp from '../functions/createPixiApp'
import Axios from 'axios'
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
import getServerHost from '../../utils/getServerHost'
import Tile from './Tile'
import { ticker, Application, Container } from 'pixi.js'

class Game {
  scale: number = DEFAULT_SCALE
  targetScale: number = DEFAULT_SCALE
  selectedArmyTile: Tile | null = null
  socket: Socket = new Socket()
  loop: ticker.Ticker | null = null
  pixi: Application | null = null
  readonly stage: { [key: string]: Container } = {}
  initialized: boolean = false
  running: boolean = false
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

  async start(
    canvas: HTMLElement,
    browserId: string,
    authOptions: {
      userId: string | null
      accessToken: string | null
      guestName: string | null
    }
  ) {
    const { GS_HOST } = getServerHost(window.location.hostname)

    // Fetch GS config
    try {
      const [{ data: gsConfig }, { data: status }] = await Promise.all([
        Axios(`http://${GS_HOST}/config`),
        Axios(`http://${GS_HOST}/status`),
      ])

      store.gsConfig = gsConfig

      if (status.timeRemaining && status.timeRemaining > 0) {
        store.error = {
          message: 'Server is closed.',
          goHome: true,
        }

        return
      }
    } catch (err) {
      store.error = {
        message: 'Connection failed.',
        goHome: false,
      }

      throw err
    }

    // Initialize
    if (!this.initialized) {
      this.setupEventListeners()
      this.setupStoreListeners()

      await loadImages()

      this.initialized = true
    }

    // Initialize PIXI
    if (!this.pixi) {
      this.loop = createGameLoop(this.update, this)
      this.pixi = createPixiApp()

      for (let i = 0; i < TILE_IMAGES.length; i++) {
        this.stage[TILE_IMAGES[i]] = new Container()
        this.pixi.stage.addChild(this.stage[TILE_IMAGES[i]])
      }
    } else {
      this.pixi.start()
    }

    // Mount PIXI renderer
    canvas.appendChild(this.pixi.view)

    // Connect to GameServer
    const { userId, accessToken, guestName } = authOptions
    await this.socket.connect(GS_HOST)
    if (userId && accessToken) {
      this.socket.send('startAsUser', `${browserId}|${userId}|${accessToken}`)
    } else {
      this.socket.send('startAsGuest', `${browserId}|${guestName}`)
    }

    // Add debug global variables
    ;(window as any).g = this
    ;(window as any).s = store

    this.running = true
  }
  stop() {
    if (!this.running || !this.socket || !this.pixi) return

    for (let i = 0; i < TILE_IMAGES.length; i++) {
      this.stage[TILE_IMAGES[i]].removeChildren()
    }

    this.running = false
    this.socket.close()
    this.pixi.stop()
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

    // Animations
    if (this.animations.length > 0) {
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

      this.pixi.stage.x = this.camera.x
      this.pixi.stage.y = this.camera.y
    } else {
      // const speed = CAMERA_SPEED
      // let cameraChange: Pixel = { x: 0, y: 0 }
      //
      // if (this.keyDown['w']) {
      //   cameraChange.y += speed * (2 / 3) * delta
      // }
      // if (this.keyDown['s']) {
      //   cameraChange.y -= speed * (2 / 3) * delta
      // }
      // if (this.keyDown['a']) {
      //   cameraChange.x += speed * (2 / 3) * delta
      // }
      // if (this.keyDown['d']) {
      //   cameraChange.x -= speed * (2 / 3) * delta
      // }
      //
      // if (cameraChange.x || cameraChange.y) {
      //   this.camera.x += cameraChange.x
      //   this.camera.y += cameraChange.y
      //
      //   this.pixi.stage.x = this.camera.x
      //   this.pixi.stage.y = this.camera.y
      // }
    }

    // Zoom
    if (store.status === 'running') {
      if (this.scale !== this.targetScale) {
        const pixel = {
          x: window.innerWidth / 2 - this.camera.x,
          y: window.innerHeight / 2 - this.camera.y,
        }
        const axial = pixelToAxial(pixel, this.scale)

        this.scale = this.targetScale

        for (let i = 0; i < store.tiles.length; i++) {
          store.tiles[i].updateScale()
        }

        for (let i = 0; i < store.armies.length; i++) {
          store.armies[i].updateScale()
        }

        for (let i = 0; i < this.animations.length; i++) {
          if (this.animations[i] instanceof GoldAnimation) {
            this.animations[i].updateScale()
          }
        }

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
  setupStoreListeners() {
    store.onChange('tiles', (tiles: Tile[]) => {
      if (!this.camera) {
        this.setCameraToAxialPosition(tiles[0].axial)
      }

      this.updateBlackOverlays()
      this.updateNeighbors()
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
    document.addEventListener('mousemove', this.handleMouseMove.bind(this))
    document.addEventListener('mousedown', this.handleMouseDown.bind(this))
    document.addEventListener('mouseup', this.handleMouseUp.bind(this))
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
    document.addEventListener('keyup', this.handleKeyUp.bind(this))
    document.addEventListener('contextmenu', this.handleContextMenu, false)
    document.addEventListener('wheel', this.handleWheelMove.bind(this))
  }
  sendChatMessage(message: string) {
    this.socket.send('chatMessage', message.slice(0, 64))
  }
  updateScreenSize() {
    if (!this.pixi) return

    this.pixi.renderer.resize(window.innerWidth, window.innerHeight)
  }
  selectPattern = (pattern: string) => {
    this.socket.send('pattern', pattern)
  }
  handleKeyDown({ key }: KeyboardEvent) {
    if (!this.running) return

    this.keyDown[key] = true
    this.updateCameraMove()

    if (key === 'Escape') {
      this.socket.send('cancel')
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

    this.socket.send('debug', `${command}|${tile.axial.x}|${tile.axial.z}`)
  }
  handleKeyUp({ key }: KeyboardEvent) {
    if (!this.running || store.status !== 'running' || !store.gsConfig) return

    this.keyDown[key] = false
    this.updateCameraMove()

    if (key === 'h' && store.gsConfig.DEBUG_MODE) {
      store.showHud = !store.showHud
    }
  }
  handleMouseDown({ clientX: x, clientY: y }: MouseEvent) {
    if (store.status !== 'running' || !this.cursor || !this.camera) return

    this.cameraDrag = {
      cursor: { x, y },
      camera: {
        x: this.camera.x,
        y: this.camera.y,
      },
    }
  }
  handleMouseUp(event: MouseEvent) {
    if (!this.running || !this.cameraDrag || !this.cursor) return

    const cursorDelta =
      Math.abs(this.cursor.x - this.cameraDrag.cursor.x) +
      Math.abs(this.cursor.y - this.cameraDrag.cursor.y)

    this.cameraDrag = null

    if (cursorDelta > 32) return

    const tile = store.hoveredTile

    if (!tile) return

    if (this.selectedArmyTile) {
      this.sendArmy(tile)
      return
    }

    if (
      tile.owner &&
      tile.owner.id === store.playerId &&
      (tile.castle || tile.base || tile.camp)
    ) {
      let isThereArmy = false

      for (let i = 0; i < store.armies.length; i++) {
        const army = store.armies[i]

        if (army.tile.id === tile.id && army.ownerId === store.playerId) {
          isThereArmy = true
        }
      }

      if (isThereArmy) {
        this.selectedArmyTile = tile
        tile.selectArmy()
        return
      }
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
    }

    if (button) {
      this.socket.send('click', `${tile.axial.x}|${tile.axial.z}|${button}`)

      if (canAttack(tile)) {
        this.predictedActionTile = tile

        setTimeout(
          (() => {
            if (this.predictedActionTile === tile) {
              this.predictedActionTile = null
            }
          }).bind(this),
          500
        )
      }
    }
  }
  handleMouseMove({ clientX: x, clientY: y }: MouseEvent) {
    this.cursor = { x, y }
  }
  handleWheelMove({ deltaY, detail }: WheelEvent) {
    if (!this.running) return

    const delta = deltaY || detail
    const zoomDirection = (delta < 0 ? -1 : 1) * -1
    const scale = this.scale + zoomDirection * ZOOM_SPEED
    const roundedScale = roundToDecimals(scale, 2)

    if (roundedScale >= MIN_SCALE && roundedScale <= MAX_SCALE) {
      this.targetScale = roundedScale
    }
  }
  handleContextMenu(event: Event) {
    event.preventDefault()
  }
  updateHoveredTileInfo() {
    if (!store.hoveredTile) return false

    const hoveredTileInfo = getHoveredTileInfo(store.hoveredTile)
    return !!hoveredTileInfo
  }
  updateNeighbors() {
    if (!store.tiles) return

    for (let i = 0; i < store.tiles.length; i++) {
      store.tiles[i].updateNeighbors()
    }
  }
  updateBorders() {
    if (!store.tiles) return

    for (let i = 0; i < store.tiles.length; i++) {
      store.tiles[i].updateBorders()
    }
  }
  updateContested() {
    if (!store.tiles) return

    for (let i = 0; i < store.tiles.length; i++) {
      const t = store.tiles[i]

      if (t === store.hoveredTile && t.isContested() && !t.owner) {
        t.addContested()
      } else {
        t.removeContested()
      }
    }
  }
  getHoveredTile() {
    if (!this.cursor || !this.camera) return

    const pixel = {
      x: this.cursor.x - this.camera.x,
      y: this.cursor.y - this.camera.y,
    }

    const axial = pixelToAxial(pixel, this.scale)

    return getTileByAxial(axial)
  }
  getTilesToCapture(tile: Tile, playerId: string) {
    if (!store.player) return []

    const tilesToCapture = []

    // A : Attack hover
    if (store.playerId === playerId) {
      if (canAttack(tile)) {
        tilesToCapture.push(tile)
      }
    }

    // B : Action
    for (let i = 0; i < store.actions.length; i++) {
      const action = store.actions[i]

      if (tilesToCapture.includes(action.tile)) continue

      if (action.type === 'attack' && action.owner.id === playerId) {
        tilesToCapture.push(action.tile)
      }
    }

    // C : Army
    if (playerId === store.playerId && this.selectedArmyTile) {
      let direction = null

      for (let i = 0; i < 6; i++) {
        if (this.selectedArmyTargetTiles[i].includes(tile)) {
          direction = i
          break
        }
      }

      if (direction !== null) {
        for (let i = 0; i < 4; i++) {
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
          if (t.ownerId === playerId && (t.castle || t.base)) {
            break
          }

          // Ally tile
          if (t.ownerId && t.ownerId === store.player.allyId) {
            break
          }

          if (t.ownerId !== playerId && !t.bedrock) {
            tilesToCapture.push(t)

            if (t.camp || t.mountain || t.village || t.castle || t.base) {
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

        if (
          !n ||
          n.bedrock ||
          n.castle ||
          n.base ||
          n.mountain ||
          tilesToCapture.includes(n)
        ) {
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
    for (let i = tilesToCapture.length - 1; i >= 0; i--) {
      const t = tilesToCapture[i]

      if (t.owner && t.owner.id === store.player.allyId) {
        tilesToCapture.splice(i, 1)
      }
    }

    return tilesToCapture
  }
  updatePatternPreviews() {
    if (!store.actions || !store.player) return

    const oldTilesWithPatternPreview = this.tilesWithPatternPreview
    const pattern: { [key: string]: string } = {}

    this.tilesWithPatternPreview = []

    // Actions
    for (let i = 0; i < store.actions.length; i++) {
      const action = store.actions[i]

      if (action.type !== 'attack') continue

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
    if (store.hoveredTile) {
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
    if (this.predictedActionTile) {
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

    const pixel = getPixelPosition(axial)

    this.camera = {
      x: window.innerWidth / 2 - pixel.x,
      y: window.innerHeight / 2 - pixel.y,
    }

    this.pixi.stage.x = this.camera.x
    this.pixi.stage.y = this.camera.y
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
    this.socket.send('request', `accept|${senderId}`)
  }
  declineRequest(senderId: string) {
    this.socket.send('request', `decline|${senderId}`)
  }
  createRequest(receiverId: string) {
    this.socket.send('request', `create|${receiverId}`)
  }
  updateBlackOverlays() {
    for (let i = 0; i < store.tiles.length; i++) {
      store.tiles[i].updateBlackOverlay()
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
      for (let i = 0; i < 4; i++) {
        const t = this.selectedArmyTargetTiles[direction][i]

        if (!t || !t.owner || t.owner.id !== store.playerId) continue

        t.addHighlight()

        if (t.castle || t.base) break
      }
    }
  }
  surrender() {
    this.socket.send('surrender')
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
      this.socket.send('sendArmy', `${x}|${z}|${index}`)
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
}

export default Game
