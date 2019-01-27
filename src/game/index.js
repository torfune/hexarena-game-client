import Game from './classes/Game'
import loadImages from './functions/loadImages'

let game = null
let cancelAlliance = null

const startGame = (rootElement, reactMethods) => {
  if (game) return

  game = new Game(rootElement, reactMethods)
  cancelAlliance = game.cancelAlliance

  // only for debug purposes
  window.game = game
}

const clearGame = () => {
  game.clear()
  game = null
}

export { startGame, clearGame, cancelAlliance, loadImages }
