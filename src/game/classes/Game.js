import * as PIXI from 'pixi.js'
import Socket from '../../Socket'
import loadImages from '../functions/loadImages'
import createGameLoop from '../functions/createGameLoop'
import createPixiApp from '../functions/createPixiApp'
import getTileByXZ from '../functions/getTileByXZ'
import getPixelPosition from '../functions/getPixelPosition'
import pixelToAxial from '../functions/pixelToAxial'
import roundToDecimals from '../functions/roundToDecimals'
import getDebugCommand from '../functions/getDebugCommand'
import getHoveredTileInfo from '../functions/getHoveredTileInfo'
import canAttack from '../functions/canAttack'
import store from '../../store'
import {
  CAMERA_SPEED,
  DEFAULT_SCALE,
  MAX_SCALE,
  MIN_SCALE,
  TILE_IMAGES,
  ZOOM_SPEED,
} from '../constants'

const GAMESERVER_HOST = process.env.REACT_APP_GAMESERVER_HOST

class Game {
  constructor() {
    this.socket = new Socket()
    this.animations = []
    this.camera = null
    this.cameraMove = { x: 0, y: 0 }
    this.cameraDrag = null
    this.cursor = null
    this.lastMouseMove = null
    this.loop = null
    this.pixi = null
    this.selectedArmyTile = null
    this.selectedArmyTargetTiles = null
    this.stage = {}
    this.imagesLoaded = false
    this.tilesWithPatternPreview = []
    this.serverTimeDiff = null
    this.keyDown = {
      a: false,
      w: false,
      d: false,
      s: false,
    }

    this.scale = DEFAULT_SCALE
    this.targetScale = this.scale

    const wheelEvent = /Firefox/i.test(navigator.userAgent)
      ? 'DOMMouseScroll'
      : 'mousewheel'

    document.addEventListener(wheelEvent, this.handleWheelMove.bind(this))
    document.addEventListener('mousemove', this.handleMouseMove.bind(this))
    document.addEventListener('mousedown', this.handleMouseDown.bind(this))
    document.addEventListener('mouseup', this.handleMouseUp.bind(this))
    document.addEventListener('keydown', this.handleKeyDown.bind(this))
    document.addEventListener('keyup', this.handleKeyUp.bind(this))
  }
  async start(rootElement, name, browserId) {
    console.log('Starting game...')

    if (!this.imagesLoaded) {
      await loadImages()
      this.imagesLoaded = true

      try {
        const response = await fetch(`http://${GAMESERVER_HOST}/config`)
        const gsConfig = await response.json()

        window.gsConfig = gsConfig
      } catch (err) {
        console.error(`Can't connect to Gameserver: ${GAMESERVER_HOST}`)
        return
      }
    }

    if (!this.pixi) {
      this.loop = createGameLoop(this.update, this)
      this.pixi = createPixiApp()

      for (let i = 0; i < TILE_IMAGES.length; i++) {
        this.stage[TILE_IMAGES[i]] = new PIXI.Container()
        this.pixi.stage.addChild(this.stage[TILE_IMAGES[i]])
      }
    } else {
      this.pixi.start()
    }

    rootElement.appendChild(this.pixi.view)
    this.setupStoreListeners()

    await this.socket.connect(GAMESERVER_HOST)
    this.socket.send('start', `${name}|${browserId}`)
  }
  stop() {
    if (!this.isRunning) return

    for (let i = 0; i < TILE_IMAGES.length; i++) {
      this.stage[TILE_IMAGES[i]].removeChildren()
    }

    this.socket.close()
    this.pixi.stop()

    this.socket = new Socket()
    this.animations = []
    this.camera = null
    this.cameraMove = { x: 0, y: 0 }
    this.cameraDrag = null
    this.cursor = null
    this.lastMouseMove = null
    this.selectedArmyTile = null
    this.selectedArmyTargetTiles = null
    this.tilesWithPatternPreview = []
    this.serverTimeDiff = null
    this.keyDown = {
      a: false,
      w: false,
      d: false,
      s: false,
    }
  }
  update() {
    if (!store.actions || !store.armies) return

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
    if (this.cameraDrag) {
      const { camera, cursor } = this.cameraDrag

      this.camera = {
        x: camera.x - (cursor.x - this.cursor.x),
        y: camera.y - (cursor.y - this.cursor.y),
      }

      this.pixi.stage.x = this.camera.x
      this.pixi.stage.y = this.camera.y
    } else if (this.cameraMove.x !== 0 && this.cameraMove.y !== 0) {
      this.camera.x += this.cameraMove.x * (CAMERA_SPEED * (2 / 3) * this.scale)
      this.camera.y += this.cameraMove.y * (CAMERA_SPEED * (2 / 3) * this.scale)

      this.pixi.stage.x = this.camera.x
      this.pixi.stage.y = this.camera.y
    } else if (this.cameraMove.x !== 0 || this.cameraMove.y !== 0) {
      this.camera.x += this.cameraMove.x * CAMERA_SPEED * this.scale
      this.camera.y += this.cameraMove.y * CAMERA_SPEED * this.scale

      this.pixi.stage.x = this.camera.x
      this.pixi.stage.y = this.camera.y
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
    const newHoveredTile = this.getHoveredTile()

    // existing -> non-existing
    if (store.hoveredTile && !newHoveredTile) {
      store.hoveredTile.endHover()
      store.hoveredTile = null
    }

    // non-existing -> existing
    if (!store.hoveredTile && newHoveredTile) {
      store.hoveredTile = newHoveredTile
      store.hoveredTile.startHover()

      this.updateHoveredTileInfo()
      this.updateContested()
      this.updatePatternPreviews()
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

      this.updateHoveredTileInfo()
      this.updateContested()
      this.updatePatternPreviews()
    }
  }
  setupStoreListeners() {
    store.onChange('tiles', tiles => {
      if (!this.camera) {
        this.setCameraToAxialPosition(tiles[0])
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

    store.onChange('serverTime', current => {
      this.serverTimeDiff = Date.now() - current
    })
  }
  sendMessage(message) {
    this.socket.send('message', message)
  }
  updateScreenSize() {
    this.pixi.renderer.resize(window.innerWidth, window.innerHeight)
  }
  selectPattern(pattern) {
    this.socket.send('select_pattern', pattern)
  }
  handleKeyDown({ key }) {
    this.keyDown[key] = true
    this.updateCameraMove()

    if (key === 'Escape') {
      this.socket.send('cancel')
      return
    }

    const tile = store.hoveredTile
    const command = getDebugCommand(key)

    if (!tile || !command) return

    this.socket.send('debug', `${command}|${tile.x}|${tile.z}`)
  }
  handleKeyUp({ key }) {
    this.keyDown[key] = false
    this.updateCameraMove()

    if (key === 'h') {
      store.showHud = !store.showHud
    }
  }
  handleMouseDown({ clientX: x, clientY: y }) {
    this.cameraDrag = {
      cursor: { x, y },
      camera: { ...this.camera },
    }
  }
  handleMouseUp(event) {
    if (!this.cameraDrag) return

    const cursorDelta =
      Math.abs(this.cursor.x - this.cameraDrag.cursor.x) +
      Math.abs(this.cursor.y - this.cameraDrag.cursor.y)

    this.cameraDrag = null

    if (cursorDelta > 32) return

    const tile = store.hoveredTile

    if (!tile) return

    if (this.selectedArmyTile) {
      let index = null

      for (let i = 0; i < 6; i++) {
        if (this.selectedArmyTargetTiles[i].includes(tile)) {
          index = i
          break
        }
      }

      if (index !== null) {
        const { x, z } = this.selectedArmyTile
        this.socket.send('send_army', `${x}|${z}|${index}`)
      }

      this.selectedArmyTile.unselectArmy()
      this.selectedArmyTile = null

      return
    }

    if (
      tile.owner &&
      tile.owner.id === store.player.id &&
      (tile.castle || tile.capital || tile.camp)
    ) {
      let isThereArmy = false

      for (let i = 0; i < store.armies.length; i++) {
        const army = store.armies[i]

        if (army.tile.id === tile.id && army.ownerId === store.player.id) {
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
      this.socket.send('click', `${tile.x}|${tile.z}|${button}`)
    }
  }
  handleMouseMove({ clientX: x, clientY: y }) {
    this.cursor = { x, y }
  }
  handleWheelMove({ deltaY, detail }) {
    const delta = deltaY || detail
    const zoomDirection = (delta < 0 ? -1 : 1) * -1
    const scale = this.scale + zoomDirection * ZOOM_SPEED
    const roundedScale = roundToDecimals(scale, 2)

    if (roundedScale >= MIN_SCALE && roundedScale <= MAX_SCALE) {
      this.targetScale = roundedScale
    }
  }
  updateHoveredTileInfo() {
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

    return getTileByXZ(axial.x, axial.z)
  }
  getTilesToCapture(tile, playerId) {
    const tilesToCapture = []

    // A : Attack hover
    if (store.player.id === playerId) {
      if (canAttack(tile)) {
        tilesToCapture.push(tile)
      }
    }

    // B : Action
    for (let i = 0; i < store.actions.length; i++) {
      const action = store.actions[i]

      if (tilesToCapture.includes(action.tile)) continue

      if (action.type === 'attack' && action.ownerId === playerId) {
        tilesToCapture.push(action.tile)
      }
    }

    // Mountains
    for (let i = tilesToCapture.length - 1; i >= 0; i--) {
      const t = tilesToCapture[i]

      if (t.mountain || t.village) {
        for (let j = 0; j < 6; j++) {
          const n = t.neighbors[j]

          if (!n) continue

          if (!n.owner && !n.bedrock && !tilesToCapture.includes(n)) {
            tilesToCapture.push(n)
          }
        }
      }
    }

    return tilesToCapture
  }
  updatePatternPreviews() {
    if (!store.actions) return

    const oldTilesWithPatternPreview = this.tilesWithPatternPreview
    const pattern = {}

    this.tilesWithPatternPreview = []

    // Actions
    for (let i = 0; i < store.actions.length; i++) {
      const action = store.actions[i]

      if (action.type !== 'attack') continue

      const tilesToCapture = this.getTilesToCapture(action.tile, action.ownerId)

      for (let j = 0; j < tilesToCapture.length; j++) {
        const t = tilesToCapture[j]

        if (this.tilesWithPatternPreview.includes(t)) continue

        this.tilesWithPatternPreview.push(t)

        for (let k = 0; k < store.players.length; k++) {
          if (store.players[k].id === action.ownerId) {
            pattern[`${t.x}|${t.z}`] = store.players[k].pattern
            break
          }
        }
      }
    }

    // Hovered tile
    if (store.hoveredTile && !store.hoveredTile.owner) {
      const tilesToCapture = this.getTilesToCapture(store.hoveredTile, store.id)

      for (let i = 0; i < tilesToCapture.length; i++) {
        const t = tilesToCapture[i]

        if (this.tilesWithPatternPreview.includes(t)) continue

        this.tilesWithPatternPreview.push(t)

        pattern[`${t.x}|${t.z}`] = store.player.pattern
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
        t.addPatternPreview(pattern[`${t.x}|${t.z}`])
      }
    }

    this.updateBorders()
  }
  setCameraToAxialPosition({ x, z }) {
    const pixel = getPixelPosition(x, z)

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
  acceptRequest(senderId) {
    this.socket.send('request', `accept|${senderId}`)
  }
  declineRequest(senderId) {
    this.socket.send('request', `decline|${senderId}`)
  }
  createRequest(receiverId) {
    this.socket.send('request', `create|${receiverId}`)
  }
  updateBlackOverlays() {
    for (let i = 0; i < store.tiles.length; i++) {
      store.tiles[i].updateBlackOverlay()
    }
  }
}

export default Game
