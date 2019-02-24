import * as PIXI from 'pixi.js'
import io from 'socket.io-client'

import Tile from './Tile'
import Player from './Player'
import Army from './Army'
import Action from './Action'
import createGameLoop from '../functions/createGameLoop'
import createPixiApp from '../functions/createPixiApp'
import getTileByXZ from '../functions/getTileByXZ'
import getItemById from '../functions/getItemById'
import getTileByPixelPosition from '../functions/getTileByPixelPosition'
import getPixelPosition from '../functions/getPixelPosition'
import pixelToAxial from '../functions/pixelToAxial'
import parseTiles from '../functions/parseTiles'
import parsePlayers from '../functions/parsePlayers'
import parseAction from '../functions/parseAction'
import parseArmy from '../functions/parseArmy'
import roundToDecimals from '../functions/roundToDecimals'
import getDebugCommand from '../functions/getDebugCommand'
import getActionPreview from '../functions/getActionPreview'
import { GAMESERVER_URL } from '../../config'
import {
  ZOOM_SPEED,
  MAX_SCALE,
  MIN_SCALE,
  DEFAULT_SCALE,
  TILE_IMAGES,
} from '../../constants'

class Game {
  constructor() {
    this.animations = []
    this.armies = []
    this.actions = []
    this.camera = { x: null, y: null }
    this.cameraDrag = null
    this.cursor = { x: null, y: null }
    this.lastMouseMove = null
    this.loop = null
    this.pixi = null
    this.playerId = null
    this.players = []
    this.react = null
    this.selectedArmyTile = null
    this.selectedArmyTargetTiles = null
    this.socket = null
    this.stage = {}
    this.tiles = []
    this.wood = null
    this.isRunning = false
    this.hoveredTile = null
    this.defeated = false
    this.scale = DEFAULT_SCALE
    this.targetScale = this.scale

    this.loop = createGameLoop(this.update, this)
    this.pixi = createPixiApp()

    for (let i = 0; i < TILE_IMAGES.length; i++) {
      this.stage[TILE_IMAGES[i]] = new PIXI.Container()
      this.pixi.stage.addChild(this.stage[TILE_IMAGES[i]])
    }

    const wheelEvent = /Firefox/i.test(navigator.userAgent)
      ? 'DOMMouseScroll'
      : 'mousewheel'

    document.addEventListener(wheelEvent, this.handleWheelMove)
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mouseup', this.handleMouseUp)
    document.addEventListener('keyup', this.handleKeyUp)
  }
  start(rootElement, reactMethods, name) {
    if (this.isRunning) return

    this.react = { ...reactMethods }

    rootElement.appendChild(this.pixi.view)

    this.socket = io(GAMESERVER_URL, { reconnection: false })
      .on('player', this.handlePlayerMessage)
      .on('tile', this.handleTileMessage)
      .on('action', this.handleActionMessage)
      .on('id', this.handleIdMessage)
      .on('leaderboard', this.handleLeaderboardMessage)
      .on('time', this.handleTimeMessage)
      .on('wood', this.handleWoodMessage)
      .on('army', this.handleArmyMessage)
      .on('connect_error', this.handleErrorMessage)
      .on('defeat', this.handleDefeatMessage)
      .on('disconnect', this.handleDisconnectMessage)

    this.socket.emit('start', name)

    this.isRunning = true
  }
  stop() {
    if (!this.isRunning) return

    for (let i = 0; i < TILE_IMAGES.length; i++) {
      this.stage[TILE_IMAGES[i]].removeChildren()
    }

    this.socket.close()

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

      this.updateHighlights()

      // if (this.hoveredTile) {
      //   this.react.setDebugInfo(`${this.hoveredTile.x}|${this.hoveredTile.z}`)
      // } else {
      //   this.react.setDebugInfo(null)
      // }
    }
  }
  handleKeyUp = ({ key }) => {
    if (!this.isRunning) return

    if (key === 'Escape') {
      this.socket.emit('cancel')
      return
    }

    const tile = this.hoveredTile
    const command = getDebugCommand(key)

    if (!tile || !command) return

    const axial = { x: tile.x, z: tile.z }

    this.socket.emit('debug', { command, axial })
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
  handleMouseUp = () => {
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
        this.socket.emit('send_army', `${x}|${z}|${index}`)
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
        if (this.armies[i].tile === tile) {
          isThereArmy = true
        }
      }

      if (isThereArmy) {
        this.selectedArmyTile = tile
        tile.selectArmy()
        return
      }
    }

    this.socket.emit('click', `${tile.x}|${tile.z}`)
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
  handleErrorMessage = () => {
    this.react.showConnectionError()
    this.stop()
  }
  handlePlayerMessage = gsData => {
    const gsPlayers = parsePlayers(gsData)

    for (let i = 0; i < gsPlayers.length; i++) {
      const gsPlayer = gsPlayers[i]
      const player = getItemById(this.players, gsPlayer.id)

      if (player) {
        console.log(`Player ${gsPlayer.id} already exists.`)
      } else {
        this.players.push(new Player({ ...gsPlayer }))
      }

      if (gsPlayer.id === this.playerId) {
        this.react.setName(gsPlayer.name)
      }
    }
  }
  handleTileMessage = gsData => {
    const gsTiles = parseTiles(gsData)

    for (let i = 0; i < gsTiles.length; i++) {
      const gsTile = gsTiles[i]
      const tile = getTileByXZ(gsTile.x, gsTile.z)
      const gsOwner = gsTile.ownerId
        ? getItemById(this.players, gsTile.ownerId)
        : null

      if (tile) {
        if (gsOwner !== tile.owner) {
          tile.setOwner(gsOwner)
        }

        const structures = [
          ['capital', 'addCapital', 'removeCapital'],
          ['castle', 'addCastle', 'removeCastle'],
          ['forest', 'addForest', 'removeForest'],
          ['village', 'addVillage', 'removeVillage'],
          ['camp', 'addCamp', 'removeCamp'],
        ]

        // Hitpoints
        if (gsTile.hitpoints && !tile.hitpoints) {
          tile.addHitpoints(gsTile.hitpoints)
        } else if (gsTile.hitpoints === null && tile.hitpoints) {
          tile.removeHitpoints()
        } else if (gsTile.hitpoints !== tile.hitpoints) {
          tile.updateHitpoints(gsTile.hitpoints)
        }

        for (let j = 0; j < structures.length; j++) {
          const [structure, addMethod, removeMethod] = structures[j]

          if (gsTile[structure] && !tile[structure]) {
            tile[addMethod]()
          } else if (!gsTile[structure] && tile[structure]) {
            tile[removeMethod]()
          }
        }
      } else {
        this.tiles.push(new Tile({ ...gsTile, owner: gsOwner }))

        if (this.tiles.length === 1) {
          this.handleFirstTileArrival()
        }
      }
    }

    this.updatePlayerTilesCount()
    this.updateNeighbors()
    this.updateBorders()
    this.updateActionPreview(this.hoveredTile)
  }
  handleActionMessage = gsData => {
    const gsAction = parseAction(gsData)
    const tile = getTileByXZ(gsAction.x, gsAction.z)

    if (!tile) return

    if (!tile.action) {
      new Action({ ...gsAction, tile })
    } else if (gsAction.destroyed) {
      tile.action.destroy()
    }
  }
  handleArmyMessage = gsData => {
    const gsArmy = parseArmy(gsData)
    const tile = getTileByXZ(gsArmy.x, gsArmy.z)
    const army = getItemById(this.armies, gsArmy.id)

    if (!tile) {
      if (army) {
        army.destroy()
      }

      return
    }

    if (!army && !gsArmy.isDestroyed) {
      const army = new Army({ ...gsArmy, tile })
      this.armies.push(army)
    } else if (army) {
      if (gsArmy.isDestroyed) {
        army.destroy()
      }

      army.moveOn(tile)
    }
  }
  handleIdMessage = id => {
    if (this.playerId) return

    this.playerId = id
    this.startedAt = Date.now()
  }
  handleLeaderboardMessage = leaders => {
    this.react.setLeaders(leaders)
  }
  handleTimeMessage = serverTime => {
    const browserTime = Date.now()
    this.timeDiff = serverTime - browserTime

    if (this.timeDiff < 0) {
      this.timeDiff = 0
    }

    console.log(`Browser time difference: ${this.timeDiff}`)
  }
  handleWoodMessage = wood => {
    this.wood = Number(wood)

    this.react.setWood(this.wood)
  }
  handleDisconnectMessage = () => {
    if (!this.defeated) {
      this.react.showConnectionError()
    }

    this.stop()
    console.log('Disconnected.')
  }
  handleFirstTileArrival = () => {
    const firstTile = this.tiles[0]

    this.setCameraToAxialPosition(firstTile)
  }
  handleDefeatMessage = killerName => {
    const msSurvived = Date.now() - this.startedAt
    const secondsSurvived = Math.floor(msSurvived / 1000)

    this.react.showDefeatScreen({ killerName, secondsSurvived })

    this.defeated = true

    console.log('Defeated.')
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
  updateActionPreview = tile => {
    const actionPreview = getActionPreview(tile)

    this.react.setActionPreview(actionPreview)

    return !!actionPreview
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
  updateHighlights = () => {
    for (let i = 0; i < this.tiles.length; i++) {
      const t = this.tiles[i]

      if (t.owner && t.owner.id === this.playerId && t.action) {
        this.tiles[i].addHighlight()
      } else {
        this.tiles[i].clearHighlight()
      }
    }

    if (!this.hoveredTile) return

    if (this.selectedArmyTile) {
      let index = null

      for (let i = 0; i < 6; i++) {
        if (this.selectedArmyTargetTiles[i].includes(this.hoveredTile)) {
          index = i
          break
        }
      }

      if (index !== null) {
        const tiles = this.selectedArmyTargetTiles[index]

        for (let i = 0; i < tiles.length; i++) {
          tiles[i].addHighlight()
        }
      }
    } else {
      const canPerformAction = this.updateActionPreview(this.hoveredTile)
      const hasArmy =
        this.hoveredTile.army &&
        this.hoveredTile.owner &&
        this.hoveredTile.owner.id === this.playerId

      if (canPerformAction || hasArmy) {
        this.hoveredTile.addHighlight()
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
  setCameraToAxialPosition = ({ x, z }) => {
    const pixel = getPixelPosition(x, z)

    this.camera = {
      x: window.innerWidth / 2 - pixel.x,
      y: window.innerHeight / 2 - pixel.y,
    }

    this.pixi.stage.x = this.camera.x
    this.pixi.stage.y = this.camera.y
  }
}

export default Game
