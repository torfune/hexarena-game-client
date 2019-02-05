import Game from './classes/Game'
import loadImages from './functions/loadImages'

let game = new Game()

const startGame = (rootElement, reactMethods) => {
  game.start(rootElement, reactMethods)

  // only for debug purposes
  window.game = game
}

const stopGame = () => {
  game.stop()
  game = new Game()
}

// named export for React layer
export { startGame, stopGame, loadImages }

// default export for Game layer
export default game
