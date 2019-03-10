import Game from './classes/Game'
import loadImages from './functions/loadImages'

const GAMESERVER_URL = process.env.REACT_APP_GAMESERVER_URL

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
      console.error(`Can't connect to Gameserver: ${GAMESERVER_URL}`)
      return
    }
  }

  game.start(rootElement, reactMethods, name, pattern)

  // Pass Gameserver constants to React layers
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
