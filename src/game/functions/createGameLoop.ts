import Game from '../classes/Game'
import { Ticker } from 'pixi.js'

const ticker = Ticker.shared

const createGameLoop = (
  updateFunction: () => void,
  gameInstanceReference: Game
) => {
  // const loop = ticker.shared

  ticker.add(updateFunction, gameInstanceReference)

  return ticker
}

export default createGameLoop
