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

    this.socket = io('http://localhost:8000')
      .on('players', this.handlePlayersMessage)
      .on('tiles', this.handleTilesMessage)
      .on('connect_error', this.handleErrorMessage)

    this.radius = tileRadius

    this.two = new Two({
      width: window.innerWidth,
      height: window.innerHeight,
      type: 'WebGLRenderer',
    }).appendTo(rootElement)

    this.tiles = []

    this.setLeaders(leaders)

    document.addEventListener('mousewheel', this.handleWheelChange)
  }
  handleWheelChange = e => {
    const zoomDirection = e.deltaY < 0 ? -1 : 1

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
      this.tiles.push(new Tile(this.two, x, z, this.radius))
    }

    this.two.update()
  }
  cancelAlliance = playerId => {
    console.log(`Canceling alliance with ${playerId}`)
  }
}

export default Game
