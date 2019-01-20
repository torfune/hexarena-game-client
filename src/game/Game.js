import io from 'socket.io-client'

import Two from '../Two'
import Tile from './Tile'
import { leaders } from '../data'

const tileRadius = 30
class Game {
  constructor(rootElement, setters) {
    // React API set methods
    this.setLeaders = setters.setLeaders
    this.showConnectionError = setters.showConnectionError

    this.radius = tileRadius
    this.tiles = []
    this.camera = { x: 0, y: 0 }
    this.cameraDrag = null

    this.socket = io('http://localhost:8000')
      .on('players', this.handlePlayersMessage)
      .on('tiles', this.handleTilesMessage)
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
  handlePlayersMessage = data => {
    const players = data.split('><')
    for (const player of players) {
      console.log(player)
    }
  }
  handleTilesMessage = data => {
    const rows = data.split('><')
    const tiles = rows.map(r => {
      const [x, z, water, mountain, forest, castle, ownerId] = r.split('|')
      return { x, z, water, mountain, forest, castle, ownerId }
    })

    for (let i = 0; i < tiles.length; i++) {
      const { x, z } = tiles[i]
      this.tiles.push(new Tile(this.two, x, z, this.radius, this.camera))
    }

    this.two.update()
  }
  cancelAlliance = playerId => {
    console.log(`Canceling alliance with ${playerId}`)
  }
}

export default Game
