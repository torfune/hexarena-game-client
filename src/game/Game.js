import io from 'socket.io-client'
import * as PIXI from 'pixi.js'

import Tile from './Tile'
import Player from './Player'
import Action from './Action'
import getTileByXZ from '../utils/getTileByXZ'
import getItemById from '../utils/getItemById'
import getTileUnderCursor from '../utils/getTileUnderCursor'
import getPixelPosition from '../utils/getPixelPosition'
import hex from '../utils/hex'
import { leaders } from '../data'
import { ZOOM_SPEED, MAX_SCALE, MIN_SCALE, DEFAULT_SCALE } from '../constants'

class Game {
  constructor(rootElement, setters) {
    // React API set methods
    this.setLeaders = setters.setLeaders
    this.showConnectionError = setters.showConnectionError

    this.scale = DEFAULT_SCALE
    this.targetScale = this.scale
    this.tiles = []
    this.players = []
    this.animations = []
    this.cursor = { x: 0, y: 0 }
    this.camera = { x: 0, y: 0 }
    this.cameraDrag = null

    this.lastMouseMove = null

    this.socket = io('http://localhost:8000')
      .on('player', this.handlePlayerMessage)
      .on('tile', this.handleTileMessage)
      .on('action', this.handleActionMessage)
      .on('connect_error', this.handleErrorMessage)

    this.pixi = new PIXI.Application({
      antialias: true,
      resolution: window.devicePixelRatio,
    })

    this.pixi.renderer.backgroundColor = hex('#fff')
    this.pixi.renderer.autoResize = true
    this.pixi.renderer.resize(window.innerWidth, window.innerHeight)

    rootElement.appendChild(this.pixi.view)

    this.loop = PIXI.ticker.shared
    this.loop.autoStart = true
    this.loop.add(this.update, this)

    document.addEventListener('mousewheel', this.handleWheelMove)
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mouseup', this.handleMouseUp)

    // temp
    this.setLeaders(leaders)
  }
  handleMouseDown = ({ clientX, clientY }) => {
    this.cameraDrag = {
      originalX: this.camera.x,
      originalY: this.camera.y,
      cursorX: clientX,
      cursorY: clientY,
    }

    const tile = getTileUnderCursor(
      this.tiles,
      this.camera,
      this.cursor,
      this.scale
    )

    if (!tile) return

    this.socket.emit('click', `${tile.x}|${tile.z}`)
  }
  handleMouseUp = () => {
    this.cameraDrag = null
  }
  handleMouseMove = ({ clientX, clientY }) => {
    this.cursor.x = clientX
    this.cursor.y = clientY

    const tile = getTileUnderCursor(
      this.tiles,
      this.camera,
      this.cursor,
      this.scale
    )

    if (!tile) return

    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].clearHighlight()
    }

    tile.addHighlight()
  }
  handleWheelMove = ({ deltaY }) => {
    const zoomDirection = (deltaY < 0 ? -1 : 1) * -1

    const newScale = this.scale + zoomDirection * ZOOM_SPEED

    if (newScale >= MIN_SCALE && newScale <= MAX_SCALE) {
      this.targetScale = newScale
    }
  }
  handleErrorMessage = () => {
    this.showConnectionError()
    this.socket.close()
  }
  handlePlayerMessage = data => {
    const { players } = this

    const arr = data.includes('><') ? data.split('><') : [data]

    for (let i = 0; i < arr.length; i++) {
      const [id, name, pattern, alliance] = arr[i].split('|')

      const player = getItemById(players, id)

      if (player) {
        console.log(`Player ${id} already exists.`)
        continue
      }

      players.push(new Player({ id, name, pattern, alliance }))
    }
  }
  handleTileMessage = data => {
    const { pixi, players, tiles, scale, animations } = this

    const arr = data.includes('><') ? data.split('><') : [data]

    for (let i = 0; i < arr.length; i++) {
      let [x, z, water, mountain, forest, castle, ownerId] = arr[i].split('|')

      x = Number(x)
      z = Number(z)
      water = water === 'true'
      mountain = mountain === 'true'
      forest = forest === 'true'
      castle = castle === 'true'
      ownerId = ownerId === 'null' ? null : ownerId

      const tile = getTileByXZ(tiles, x, z)
      const owner = ownerId ? getItemById(players, ownerId) : null

      if (tile) {
        if (tile.owner !== owner) {
          tile.setOwner(owner)
        }

        continue
      }

      tiles.push(
        new Tile({
          x,
          z,
          animations,
          stage: pixi.stage,
          scale,
          camera: this.camera,
          owner,
          castle,
          forest,
          mountain,
          water,
        })
      )

      if (tiles.length === 1) {
        this.setCameraToTile(tiles[0])
      }
    }
  }
  handleActionMessage = data => {
    const split = data.split('|')
    let [
      x,
      z,
      duration,
      finishedAt,
      canceledAt,
      ownerId,
      counterPlayerId,
    ] = split

    x = Number(x)
    z = Number(z)
    duration = Number(duration)
    finishedAt = Number(finishedAt)
    canceledAt = Number(canceledAt)

    const tile = getTileByXZ(this.tiles, x, z)

    if (!tile) return

    if (tile.action) {
      tile.action.finishedAt = finishedAt
      tile.action.canceledAt = canceledAt
      tile.action.duration = duration
    } else {
      tile.action = new Action({
        tile,
        stage: this.pixi.stage,
        duration,
        finishedAt,
        canceledAt,
        ownerId,
        counterPlayerId,
      })
    }
  }
  cancelAlliance = playerId => {
    console.log(`Canceling alliance with ${playerId}`)
  }
  clear = () => {
    document.removeEventListener('mousewheel', this.handleWheelMove)
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mousedown', this.handleMouseDown)
    document.removeEventListener('mouseup', this.handleMouseUp)

    this.socket.close()
    clearInterval(this.loop)
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
        x: cameraDrag.originalX - (cameraDrag.cursorX - cursor.x),
        y: cameraDrag.originalY - (cameraDrag.cursorY - cursor.y),
      }

      this.pixi.stage.x = this.camera.x
      this.pixi.stage.y = this.camera.y
    }

    // update zoom
    if (this.scale !== this.targetScale) {
      this.scale = this.targetScale

      for (let i = 0; i < tiles.length; i++) {
        tiles[i].setScale(this.targetScale)
      }
    }

    // update actions
    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i].action) {
        tiles[i].action.update()
      }
    }
  }
  setCameraToTile = tile => {
    const pixel = getPixelPosition(tile.x, tile.z, this.scale)
    const screenCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

    this.camera.x = screenCenter.x - pixel.x
    this.camera.y = screenCenter.y - pixel.y

    this.pixi.stage.x = this.camera.x
    this.pixi.stage.y = this.camera.y
  }
}

export default Game
