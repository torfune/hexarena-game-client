import Game from './classes/Game'
import loadImages from './functions/loadImages'
import { GAMESERVER_URL } from '../config'

const game = new Game()
let imagesLoaded = false

const startGame = async (rootElement, reactMethods, name) => {
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

  game.start(rootElement, reactMethods, name)

  // only for debug purposes
  window.game = game
}

const stopGame = () => {
  game.stop()
}

// named export for React layer
export { startGame, stopGame }

// default export for Game layer
export default game
