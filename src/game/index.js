import Game from './Game'

let game = null
let cancelAlliance = null

const startGame = (rootElement, setters) => {
  if (game) return

  game = new Game(rootElement, setters)
  cancelAlliance = game.cancelAlliance

  // only for debug purposes
  window.game = game
}

export { startGame, cancelAlliance }
