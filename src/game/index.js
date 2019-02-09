import Game from './classes/Game'
import loadImages from './functions/loadImages'

let game = new Game()
let imagesLoaded = false

const startGame = async (rootElement, reactMethods) => {
  if (!imagesLoaded) {
    await loadImages()
    imagesLoaded = true
  }

  game.start(rootElement, reactMethods)

  // only for debug purposes
  window.game = game
}

const stopGame = () => {
  game.stop()
  game = new Game()
}

// named export for React layer
export { startGame, stopGame }

// default export for Game layer
export default game
