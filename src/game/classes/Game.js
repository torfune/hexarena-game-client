import * as PIXI from 'pixi.js'
import io from 'socket.io-client'
import { navigate } from '@reach/router'

import Tile from './Tile'
import Player from './Player'
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
import { GAMESERVER_URL } from '../../config'
import {
  ZOOM_SPEED,
  MAX_SCALE,
  MIN_SCALE,
  DEFAULT_SCALE,
  TILE_IMAGES,
} from '../../constants'
import getActionPreview from '../functions/getActionPreview'

class Game {
  constructor() {
    this.animations = []
    this.camera = { x: null, y: null }
    this.cameraDrag = null
    this.cursor = { x: null, y: null }
    this.lastMouseMove = null
    this.loop = null
    this.pixi = null
    this.playerId = null
    this.players = []
    this.react = null
    this.scale = null
    this.socket = null
    this.stage = {}
    this.targetScale = null
    this.tiles = []
  }
  start(rootElement, reactMethods) {
    this.react = { ...reactMethods }
    this.scale = DEFAULT_SCALE
    this.targetScale = this.scale

    this.pixi = createPixiApp(rootElement)
    this.loop = createGameLoop(this.update, this)

    this.socket = io(GAMESERVER_URL, { reconnection: false })
      .on('player', this.handlePlayerMessage)
      .on('tile', this.handleTileMessage)
      .on('action', this.handleActionMessage)
      .on('id', this.handleIdMessage)
      .on('leaderboard', this.handleLeaderboardMessage)
      .on('time', this.handleTimeMessage)
      .on('connect_error', this.handleErrorMessage)
      .on('disconnect', this.handleDisconnectMessage)

    for (let i = 0; i < TILE_IMAGES.length; i++) {
      this.stage[TILE_IMAGES[i]] = new PIXI.Container()
      this.pixi.stage.addChild(this.stage[TILE_IMAGES[i]])
    }

    document.addEventListener('mousewheel', this.handleWheelMove)
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mouseup', this.handleMouseUp)
    document.addEventListener('keyup', this.handleKeyUp)
  }
  update = () => {
    const { animations, cameraDrag, cursor, tiles } = this

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

      this.setCameraToAxialPosition(axial)
    }

    // update actions
    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i].action) {
        tiles[i].action.update()
      }
    }
  }
  stop = () => {
    document.removeEventListener('mousewheel', this.handleWheelMove)
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mousedown', this.handleMouseDown)
    document.removeEventListener('mouseup', this.handleMouseUp)

    this.socket.close()
    clearInterval(this.loop)
  }
  handleKeyUp = ({ key }) => {
    const tile = this.getTileUnderCursor()

    if (!tile) return

    const axial = { x: tile.x, z: tile.z }

    switch (key) {
      case '1':
        this.socket.emit('debug', {
          action: 'capture',
          axial,
        })
        break
      default:
    }
  }
  handleMouseDown = ({ clientX: x, clientY: y }) => {
    this.cameraDrag = {
      cursor: { x, y },
      camera: {
        x: this.camera.x,
        y: this.camera.y,
      },
    }

    const tile = this.getTileUnderCursor()

    if (!tile) return

    this.socket.emit('click', `${tile.x}|${tile.z}`)
  }
  handleMouseUp = () => {
    this.cameraDrag = null
  }
  handleMouseMove = ({ clientX: x, clientY: y }) => {
    this.cursor = { x, y }

    const tile = this.getTileUnderCursor()
    const canPerformAction = this.updateActionPreview(tile)

    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].clearHighlight()
    }

    if (tile) {
      this.react.setDebugInfo(`${tile.x}|${tile.z}`)
    } else {
      this.react.setDebugInfo(null)
    }

    if (tile && canPerformAction) {
      tile.addHighlight()
    }
  }
  handleWheelMove = ({ deltaY }) => {
    const zoomDirection = (deltaY < 0 ? -1 : 1) * -1

    const newScale = this.scale + zoomDirection * ZOOM_SPEED

    if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
      this.targetScale = newScale
    }
  }
  handleErrorMessage = () => {
    this.react.showConnectionError()
    this.socket.close()
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

        if (gsTile.castle) {
          tile.addCastle()
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
    this.updateActionPreview(this.getTileUnderCursor())
  }
  handleActionMessage = gsData => {
    const gsAction = parseAction(gsData)
    const tile = getTileByXZ(gsAction.x, gsAction.z)

    if (!tile) return

    if (tile.action) {
      if (gsAction.destroyed) {
        tile.action.destroy()
        return
      }

      tile.action.finishedAt = gsAction.finishedAt
      tile.action.duration = gsAction.duration
    } else {
      tile.action = new Action({ ...gsAction, tile })
    }
  }
  handleIdMessage = id => {
    this.playerId = id
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
  handleDisconnectMessage = () => {
    this.stop()
    navigate('/')
    console.log('Disconnected.')
  }
  handleFirstTileArrival = () => {
    const firstTile = this.tiles[0]

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
  getTileUnderCursor = () => {
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
