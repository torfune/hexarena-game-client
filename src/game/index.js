import Game from './classes/Game'
import loadImages from './functions/loadImages'
import { GAMESERVER_URL } from '../config'

const game = new Game()
let imagesLoaded = false

const startGame = async (rootElement, reactMethods, name, pattern) => {
  if (!imagesLoaded) {
    await loadImages()
    imagesLoaded = true

    try {
      const response = await fetch(`${GAMESERVER_URL}/config`)
      const gsConfig = await response.json()

      window.gsConfig = gsConfig
    } catch (err) {
      reactMethods.showConnectionError()
    }
  }

  game.start(rootElement, reactMethods, name, pattern)

  // Pass Gameserver constants to React layer
  reactMethods.setMinPlayers(window.gsConfig.MIN_PLAYERS)

  // Only for debug purposes
  window.game = game
}

const stopGame = () => {
  game.stop()
}

const sendMessage = game.sendMessage
const updateScreenSize = game.updateScreenSize

// Named export for React layer
export { startGame, stopGame, sendMessage, updateScreenSize }

// Default export for Game layer
export default game
