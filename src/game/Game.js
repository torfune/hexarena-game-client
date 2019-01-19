import Two from '../Two'
import renderTiles from './renderTiles'
import { tiles, leaders } from '../data'

class Game {
  constructor(rootElement, setters) {
    // React API set methods
    this.setLeaders = setters.setLeaders

    this.two = new Two({
      width: 1000,
      height: 800,
      type: 'WebGLRenderer',
    }).appendTo(rootElement)

    this.radius = 30

    renderTiles(this.two, tiles, this.radius)

    document.addEventListener('mousewheel', this.handleWheelChange)

    this.setLeaders(leaders)
  }
  handleWheelChange = e => {
    this.radius--

    renderTiles(this.two, tiles, this.radius)
  }
  cancelAlliance = playerId => {
    console.log(`Canceling alliance with ${playerId}`)
  }
}

export default Game
