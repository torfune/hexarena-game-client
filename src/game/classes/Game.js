import * as PIXI from 'pixi.js'
import Messenger from './Messenger'
import createGameLoop from '../functions/createGameLoop'
import createPixiApp from '../functions/createPixiApp'
import getTileByPixelPosition from '../functions/getTileByPixelPosition'
import getPixelPosition from '../functions/getPixelPosition'
import pixelToAxial from '../functions/pixelToAxial'
import roundToDecimals from '../functions/roundToDecimals'
import getDebugCommand from '../functions/getDebugCommand'
import getHoveredTileInfo from '../functions/getHoveredTileInfo'
import canAttack from '../functions/canAttack'
import {
  ZOOM_SPEED,
  MAX_SCALE,
  MIN_SCALE,
  DEFAULT_SCALE,
  TILE_IMAGES,
  CAMERA_SPEED,
} from '../constants'

class Game {
  constructor() {
    this.animations = []
    this.armies = []
    this.actions = []
    this.actionQueue = []
    this.camera = { x: null, y: null }
    this.cameraMove = { x: 0, y: 0 }
    this.cameraDrag = null
    this.cursor = { x: null, y: null }
    this.lastMouseMove = null
    this.loop = null
    this.pixi = null
    this.player = null
    this.playerId = null
    this.players = []
    this.react = null
    this.selectedArmyTile = null
    this.selectedArmyTargetTiles = null
    this.socket = null
    this.stage = {}
    this.tiles = []
    this.wood = null
    this.hoveredTile = null
    this.isRunning = false
    this.defeated = false
    this.tilesWithPatternPreview = []
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

    document.addEventListener(wheelEvent, this.handleWheelMove)
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mouseup', this.handleMouseUp)
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
  }
  start(rootElement, reactMethods, name) {
    if (this.isRunning) return

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

    this.react = { ...reactMethods }

    rootElement.appendChild(this.pixi.view)

    this.messenger = new Messenger()
    this.messenger.emit('start', name)

    this.isRunning = true
  }
  stop() {
    if (!this.isRunning) return

    for (let i = 0; i < TILE_IMAGES.length; i++) {
      this.stage[TILE_IMAGES[i]].removeChildren()
    }

    this.messenger.close()
    this.pixi.stop()

    this.animations = []
    this.armies = []
    this.camera = { x: null, y: null }
    this.cameraDrag = null
    this.cursor = { x: null, y: null }
    this.lastMouseMove = null
    this.playerId = null
    this.players = []
    this.react = null
    this.selectedArmyTile = null
    this.socket = null
    this.targetScale = this.scale
    this.tiles = []
    this.wood = null
    this.isRunning = false
    this.defeated = false
  }
  update = () => {
    if (!this.isRunning) return

    const { animations, cameraDrag, cursor, tiles, armies, actions } = this

    // update animations
    if (animations.length) {
      for (let i = animations.length - 1; i >= 0; i--) {
        animations[i].update()

        if (animations[i].finished) {
          animations.splice(i, 1)
        }
      }
    }

    // update camera
    if (cameraDrag) {
      this.camera = {
        x: cameraDrag.camera.x - (cameraDrag.cursor.x - cursor.x),
        y: cameraDrag.camera.y - (cameraDrag.cursor.y - cursor.y),
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

    // update zoom
    if (this.scale !== this.targetScale) {
      const pixel = {
        x: window.innerWidth / 2 - this.camera.x,
        y: window.innerHeight / 2 - this.camera.y,
      }
      const axial = pixelToAxial(pixel, this.scale)

      this.scale = this.targetScale

      for (let i = 0; i < tiles.length; i++) {
        tiles[i].updateScale()
      }

      for (let i = 0; i < armies.length; i++) {
        armies[i].updateScale()
      }

      this.setCameraToAxialPosition(axial)
    }

    // update actions
    for (let i = 0; i < actions.length; i++) {
      actions[i].update()
    }

    // update armies
    for (let i = 0; i < armies.length; i++) {
      armies[i].update()
    }

    // update hovered tile
    const newHoveredTile = this.getHoveredTile()
    if (newHoveredTile !== this.hoveredTile) {
      if (this.hoveredTile) {
        this.hoveredTile.endHover()
      }

      if (newHoveredTile) {
        newHoveredTile.startHover()
      }

      this.hoveredTile = newHoveredTile

      this.updateHoveredTileInfo(this.hoveredTile)
      this.updateNamePreview(this.hoveredTile)
      this.updateContested()
      this.updatePatternPreviews()
    }
  }
  sendMessage = message => {
    this.messenger.emit('message', message)
  }
  updateScreenSize = () => {
    this.pixi.renderer.resize(window.innerWidth, window.innerHeight)
  }
  selectPattern = pattern => {
    this.messenger.emit('select_pattern', pattern)
  }
  handleKeyDown = ({ key }) => {
    if (!this.isRunning) return

    this.keyDown[key] = true
    this.updateCameraMove()

    if (key === 'Escape') {
      this.messenger.emit('cancel')
      return
    }

    const tile = this.hoveredTile
    const command = getDebugCommand(key)

    if (!tile || !command) return

    const axial = { x: tile.x, z: tile.z }

    this.messenger.emit('debug', { command, axial })
  }
  handleKeyUp = ({ key }) => {
    if (!this.isRunning) return

    this.keyDown[key] = false
    this.updateCameraMove()
  }
  handleMouseDown = ({ clientX: x, clientY: y }) => {
    if (!this.isRunning) return

    this.cameraDrag = {
      cursor: { x, y },
      camera: {
        x: this.camera.x,
        y: this.camera.y,
      },
    }
  }
  handleMouseUp = event => {
    if (!this.cameraDrag || !this.isRunning) return

    const cursorDelta =
      Math.abs(this.cursor.x - this.cameraDrag.cursor.x) +
      Math.abs(this.cursor.y - this.cameraDrag.cursor.y)

    this.cameraDrag = null

    if (cursorDelta > 32) return

    const tile = this.hoveredTile

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
        this.messenger.emit('send_army', `${x}|${z}|${index}`)
      }

      this.selectedArmyTile.unselectArmy()
      this.selectedArmyTile = null

      return
    }

    if (
      tile.owner &&
      tile.owner.id === this.playerId &&
      (tile.castle || tile.capital || tile.camp)
    ) {
      let isThereArmy = false

      for (let i = 0; i < this.armies.length; i++) {
        const army = this.armies[i]

        if (army.tile === tile && army.ownerId === this.playerId) {
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
      this.messenger.emit('click', `${tile.x}|${tile.z}|${button}`)
    }
  }
  handleMouseMove = ({ clientX: x, clientY: y }) => {
    if (!this.isRunning) return

    this.cursor = { x, y }
  }
  handleWheelMove = ({ deltaY, detail }) => {
    if (!this.isRunning) return

    const delta = deltaY || detail
    const zoomDirection = (delta < 0 ? -1 : 1) * -1
    const scale = this.scale + zoomDirection * ZOOM_SPEED
    const roundedScale = roundToDecimals(scale, 2)

    if (roundedScale >= MIN_SCALE && roundedScale <= MAX_SCALE) {
      this.targetScale = roundedScale
    }
  }
  handleFirstTileArrival = () => {
    const firstTile = this.tiles[0]

    this.react.showGame()
    this.setCameraToAxialPosition(firstTile)
  }
  updatePlayerTilesCount = () => {
    let tilesCount = 0

    for (let i = 0; i < this.tiles.length; i++) {
      const owner = this.tiles[i].owner

      if (owner && owner.id === this.playerId) {
        tilesCount++
      }
    }

    this.react.setTilesCount(tilesCount)
  }
  updateHoveredTileInfo = tile => {
    const hoveredTileInfo = getHoveredTileInfo(tile)

    this.react.setHoveredTileInfo(hoveredTileInfo)

    return !!hoveredTileInfo
  }
  updateNamePreview = tile => {
    if (!tile || !tile.owner || tile.owner.id === this.playerId) {
      this.react.setNamePreview(null)
    } else {
      this.react.setNamePreview(tile.owner.name)
    }
  }
  updateNeighbors = () => {
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].updateNeighbors(this.tiles)
    }
  }
  updateBorders = () => {
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].updateBorders()
    }
  }
  updateContested = () => {
    for (let i = 0; i < this.tiles.length; i++) {
      const t = this.tiles[i]

      if (t === this.hoveredTile && t.isContested() && !t.owner) {
        this.tiles[i].addContested()
      } else {
        this.tiles[i].removeContested()
      }
    }
  }
  getHoveredTile = () => {
    if (!this.cursor || !this.camera) return

    const pixel = {
      x: this.cursor.x - this.camera.x,
      y: this.cursor.y - this.camera.y,
    }

    return getTileByPixelPosition(this.tiles, pixel, this.scale)
  }
  getTilesToCapture = (tile, playerId) => {
    let tilesToCapture = []

    // A : Attack hover
    if (this.playerId === playerId) {
      if (canAttack(tile)) {
        tilesToCapture.push(tile)
      }
    }

    // B : Action
    for (let i = 0; i < this.actions.length; i++) {
      const action = this.actions[i]

      if (action.type === 'attack' && action.ownerId === playerId) {
        tilesToCapture.push(action.tile)
      }
    }

    // C : Army send
    // if (this.selectedArmyTile) {
    //   let index = null

    //   for (let i = 0; i < 6; i++) {
    //     if (this.selectedArmyTargetTiles[i].includes(tile)) {
    //       index = i
    //       break
    //     }
    //   }

    //   if (index !== null) {
    //     const tiles = this.selectedArmyTargetTiles[index]

    //     for (let i = 0; i < tiles.length; i++) {
    //       if (!tiles[i].owner && !tilesToCapture.includes(tiles[i])) {
    //         tilesToCapture.push(tiles[i])
    //         if (tiles[i].mountain || tiles[i].castle) {
    //           break
    //         }
    //       } else if (
    //         tiles[i].owner &&
    //         tiles[i].owner.id !== this.playerId &&
    //         !tilesToCapture.includes(tiles[i])
    //       ) {
    //         if (tiles[i].mountain) {
    //           break
    //         }
    //         tilesToCapture.push(tiles[i])
    //         if (tiles[i].castle || tiles[i].capital) {
    //           break
    //         }
    //       }
    //     }
    //   }
    // }

    // Mountains
    for (let i = tilesToCapture.length - 1; i >= 0; i--) {
      const t = tilesToCapture[i]

      if (t.mountain || t.village) {
        for (let j = 0; j < 6; j++) {
          const neighbor = t.neighbors[j]

          if (!neighbor) continue

          if (
            !tilesToCapture.includes(neighbor) &&
            (!neighbor.owner || neighbor.owner.id !== playerId)
          ) {
            tilesToCapture.push(neighbor)
          }
        }
      }
    }

    return tilesToCapture
  }
  updatePatternPreviews = () => {
    const actions = []
    for (let i = 0; i < this.actions.length; i++) {
      if (this.actions[i].type === 'attack') {
        actions.push(this.actions[i])
      }
    }

    const oldTilesWithPatternPreview = this.tilesWithPatternPreview
    this.tilesWithPatternPreview = []

    const pattern = {}

    for (let i = 0; i < actions.length; i++) {
      const tilesToCapture = this.getTilesToCapture(
        actions[i].tile,
        actions[i].ownerId
      )

      for (let j = 0; j < tilesToCapture.length; j++) {
        const t = tilesToCapture[j]

        if (this.tilesWithPatternPreview.includes(t)) continue

        this.tilesWithPatternPreview.push(t)

        for (let k = 0; k < this.players.length; k++) {
          if (this.players[k].id === actions[i].ownerId) {
            pattern[`${t.x}|${t.z}`] = this.players[k].pattern
            break
          }
        }
      }
    }

    if (this.hoveredTile && !this.hoveredTile.owner) {
      const tilesToCapture = this.getTilesToCapture(
        this.hoveredTile,
        this.playerId
      )

      for (let i = 0; i < tilesToCapture.length; i++) {
        const t = tilesToCapture[i]

        if (this.tilesWithPatternPreview.includes(t)) continue

        this.tilesWithPatternPreview.push(t)

        for (let j = 0; j < this.players.length; j++) {
          if (this.players[j].id === this.playerId) {
            pattern[`${t.x}|${t.z}`] = this.players[j].pattern
            break
          }
        }
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
  setCameraToAxialPosition = ({ x, z }) => {
    const pixel = getPixelPosition(x, z)

    this.camera = {
      x: window.innerWidth / 2 - pixel.x,
      y: window.innerHeight / 2 - pixel.y,
    }

    this.pixi.stage.x = this.camera.x
    this.pixi.stage.y = this.camera.y
  }
  updateCameraMove = () => {
    this.cameraMove = { x: 0, y: 0 }

    if (this.keyDown['d']) {
      this.cameraMove.x--
    }

    if (this.keyDown['a']) {
      this.cameraMove.x++
    }

    if (this.keyDown['s']) {
      this.cameraMove.y--
    }

    if (this.keyDown['w']) {
      this.cameraMove.y++
    }
  }
}

export default Game
