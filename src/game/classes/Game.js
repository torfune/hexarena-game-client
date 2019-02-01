import * as PIXI from 'pixi.js'
import io from 'socket.io-client'

import Tile from './Tile'
import Player from './Player'
import Action from './Action'
import createGameLoop from '../functions/createGameLoop'
import createPixiApp from '../functions/createPixiApp'
import getTileByXZ from '../functions/getTileByXZ'
import getItemById from '../functions/getItemById'
import getTileByPixelPosition from '../functions/getTileByPixelPosition'
import getPixelPosition from '../functions/getPixelPosition'
import getAttackDuration from '../functions/getAttackDuration'
import pixelToAxial from '../functions/pixelToAxial'
import { useRemoteGameServer } from '../../config'
import {
  ZOOM_SPEED,
  MAX_SCALE,
  MIN_SCALE,
  DEFAULT_SCALE,
} from '../../constants'

class Game {
  constructor(rootElement, reactMethods) {
    this.react = { ...reactMethods }
    this.scale = DEFAULT_SCALE
    this.targetScale = this.scale
    this.tiles = []
    this.players = []
    this.animations = []
    this.cursor = { x: 0, y: 0 }
    this.camera = { x: 0, y: 0 }
    this.cameraDrag = null
    this.lastMouseMove = null
    this.playerId = null

    const gsUrl = useRemoteGameServer
      ? 'http://dev.hexagor.io:8000'
      : 'http://localhost:8000'

    this.socket = io(gsUrl)
      .on('player', this.handlePlayerMessage)
      .on('tile', this.handleTileMessage)
      .on('action', this.handleActionMessage)
      .on('id', this.handleIdMessage)
      .on('leaderboard', this.handleLeaderboardMessage)
      .on('time', this.handleTimeMessage)
      .on('connect_error', this.handleErrorMessage)

    this.pixi = createPixiApp(rootElement)
    this.loop = createGameLoop(this.update, this)

    this.stages = {
      waters: new PIXI.Container(),
      actions: new PIXI.Container(),
      capitals: new PIXI.Container(),
      mountains: new PIXI.Container(),
      forests: new PIXI.Container(),
      patterns: new PIXI.Container(),
      backgrounds: new PIXI.Container(),
    }

    this.pixi.stage.addChild(this.stages.backgrounds)
    this.pixi.stage.addChild(this.stages.patterns)
    this.pixi.stage.addChild(this.stages.mountains)
    this.pixi.stage.addChild(this.stages.forests)
    this.pixi.stage.addChild(this.stages.capitals)
    this.pixi.stage.addChild(this.stages.actions)
    this.pixi.stage.addChild(this.stages.waters)

    document.addEventListener('mousewheel', this.handleWheelMove)
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mouseup', this.handleMouseUp)
    document.addEventListener('keyup', this.handleKeyUp)
  }
  handleKeyUp = ({ key }) => {
    const tile = this.getTileUnderCursor()

    if (!tile) return

    switch (key) {
      case '1':
        tile.showTestSprite('mountain')
        break
      case '2':
        tile.showTestSprite('forest')
        break
      case '3':
        tile.showTestSprite('castle')
        break
      default:
    }
  }
  handleMouseDown = ({ clientX, clientY }) => {
    this.cameraDrag = {
      originalX: this.camera.x,
      originalY: this.camera.y,
      cursorX: clientX,
      cursorY: clientY,
    }

    const tile = this.getTileUnderCursor()

    if (!tile) return

    this.socket.emit('click', `${tile.x}|${tile.z}`)
  }
  handleMouseUp = () => {
    this.cameraDrag = null
  }
  handleMouseMove = ({ clientX, clientY }) => {
    this.cursor.x = clientX
    this.cursor.y = clientY

    const tile = this.getTileUnderCursor()
    const canPerformAction = this.updateActionPreview(tile)

    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].clearHighlight()
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

      if (id === this.playerId) {
        this.react.setName(name)
      }
    }
  }
  handleTileMessage = data => {
    const { players, tiles, scale, animations } = this

    const arr = data.includes('><') ? data.split('><') : [data]

    for (let i = 0; i < arr.length; i++) {
      let [x, z, water, mountain, forest, castle, ownerId, capital] = arr[
        i
      ].split('|')

      x = Number(x)
      z = Number(z)
      water = water === 'true'
      mountain = mountain === 'true'
      forest = forest === 'true'
      castle = castle === 'true'
      ownerId = ownerId === 'null' ? null : ownerId
      capital = capital === 'true'

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
          stages: this.stages,
          scale,
          camera: this.camera,
          owner,
          castle,
          forest,
          mountain,
          water,
          capital,
        })
      )

      if (tiles.length === 1) {
        this.setCameraToAxialPosition(tiles[0])
      }
    }

    this.updatePlayerTilesCount()
    this.updateNeighbors()
    this.updateActionPreview(this.getTileUnderCursor())
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
        stages: this.stages,
        duration,
        finishedAt,
        canceledAt,
        ownerId,
        counterPlayerId,
        timeDiff: this.timeDiff,
      })
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
  cancelAlliance = playerId => {
    // todo: implement
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
      const pixel = {
        x: window.innerWidth / 2 - this.camera.x,
        y: window.innerHeight / 2 - this.camera.y,
      }

      const axial = pixelToAxial(pixel, this.scale)

      this.scale = this.targetScale

      for (let i = 0; i < tiles.length; i++) {
        tiles[i].setScale(this.targetScale)
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
  setCameraToAxialPosition = ({ x, z }) => {
    const pixel = getPixelPosition(x, z, this.scale)
    const screenCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

    this.camera.x = screenCenter.x - pixel.x
    this.camera.y = screenCenter.y - pixel.y

    this.pixi.stage.x = this.camera.x
    this.pixi.stage.y = this.camera.y
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
    let actionPreview = null

    if (tile) {
      let isNeighborToPlayer = false

      for (let i = 0; i < 6; i++) {
        const neighbor = tile.neighbors[i]

        if (!neighbor) continue

        if (neighbor.owner && neighbor.owner.id === this.playerId) {
          isNeighborToPlayer = true
          break
        }
      }

      if (
        isNeighborToPlayer &&
        (!tile.owner || tile.owner.id !== this.playerId)
      ) {
        let terrain = 'Plains'

        if (tile.mountain) {
          terrain = 'Mountains'
        }

        if (tile.forest) {
          terrain = 'Forest'
        }

        const durationMs = getAttackDuration(this.playerId, tile)

        actionPreview = {
          label: 'Attack',
          terrain,
          duration: `${durationMs / 1000}s`,
        }
      }
    }

    this.react.setActionPreview(actionPreview)

    return !!actionPreview
  }
  updateNeighbors = () => {
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].updateNeighbors(this.tiles)
    }
  }
  getTileUnderCursor = () => {
    const pixel = {
      x: this.cursor.x - this.camera.x,
      y: this.cursor.y - this.camera.y,
    }

    return getTileByPixelPosition(this.tiles, pixel, this.scale)
  }
}

export default Game
