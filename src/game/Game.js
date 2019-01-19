import Two from '../Two'
import Tile from './Tile'
import { tiles, leaders } from '../data'

const tileRadius = 30
class Game {
  constructor(rootElement, setters) {
    // React API set methods
    this.setLeaders = setters.setLeaders

    this.radius = tileRadius

    this.two = new Two({
      width: 1000,
      height: 800,
      type: 'WebGLRenderer',
    }).appendTo(rootElement)

    this.tiles = []
    for (let i = 0; i < tiles.length; i++) {
      const { x, z } = tiles[i]
      this.tiles.push(new Tile(this.two, x, z, this.radius))
    }
    this.two.update()

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
  cancelAlliance = playerId => {
    console.log(`Canceling alliance with ${playerId}`)
  }
}

export default Game
