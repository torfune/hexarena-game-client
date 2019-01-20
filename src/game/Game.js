import io from 'socket.io-client'

import Two from '../Two'
import Tile from './Tile'
import Player from './Player'
import getTileByXZ from '../utils/getTileByXZ'
import getItemById from '../utils/getItemById'
import { leaders } from '../data'
import getTileUnderCursor from '../utils/getTileUnderCursor'

const tileRadius = 30
class Game {
  constructor(rootElement, setters) {
    // React API set methods
    this.setLeaders = setters.setLeaders
    this.showConnectionError = setters.showConnectionError

    this.radius = tileRadius
    this.tiles = []
    this.players = []
    this.camera = { x: 0, y: 0 }
    this.cameraDrag = null

    this.socket = io('http://localhost:8000')
      .on('player', this.handlePlayerMessage)
      .on('tile', this.handleTileMessage)
      .on('connect_error', this.handleErrorMessage)

    this.two = new Two({
      width: window.innerWidth,
      height: window.innerHeight,
      type: 'WebGLRenderer',
    }).appendTo(rootElement)

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
  }
  handleMouseUp = () => {
    this.cameraDrag = null
  }
  handleMouseMove = ({ clientX, clientY }) => {
    const { cameraDrag } = this

    const cursor = { x: clientX, y: clientY }
    const tile = getTileUnderCursor(
      this.tiles,
      this.camera,
      cursor,
      this.radius
    )

    if (tile) {
      for (let i = 0; i < this.tiles.length; i++) {
        this.tiles[i].image.opacity = 1
      }

      tile.image.opacity = 0

      this.two.update()
    }

    if (!cameraDrag) return

    this.camera = {
      x: cameraDrag.originalX - (cameraDrag.cursorX - clientX),
      y: cameraDrag.originalY - (cameraDrag.cursorY - clientY),
    }

    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].updateCamera(this.camera)
    }

    this.two.update()
  }
  handleWheelMove = ({ deltaY }) => {
    const zoomDirection = deltaY < 0 ? -1 : 1

    this.radius += zoomDirection * 2

    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].setRadius(this.radius)
    }

    this.two.update()
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
    const { players, tiles, two, radius, camera } = this

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

      if (tile) {
        console.log(`Tile [${x}|${z}] already exists.`)
        continue
      }

      const owner = ownerId ? getItemById(players, ownerId) : null

      tiles.push(
        new Tile({
          x,
          z,
          two,
          radius,
          camera,
          owner,
          castle,
          forest,
          mountain,
          water,
        })
      )
    }

    this.two.update()
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
  }
}

export default Game
