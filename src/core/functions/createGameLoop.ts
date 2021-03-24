import Game from '../classes/Game'
import { Ticker } from 'pixi.js-legacy'

const ticker = Ticker.shared

const createGameLoop = (
  updateFunction: (delta: number) => void,
  game: Game
) => {
  ticker.add(updateFunction, game)
  return ticker
}

export default createGameLoop
