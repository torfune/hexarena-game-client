import Game from '../classes/Game'
import { ticker } from 'pixi.js'

const createGameLoop = (
  updateFunction: () => void,
  gameInstanceReference: Game
) => {
  const loop = ticker.shared

  loop.add(updateFunction, gameInstanceReference)

  return loop
}

export default createGameLoop
