import Game from '../classes/Game'

const createGameLoop = (
  updateFunction: () => void,
  gameInstanceReference: Game
) => {
  const loop = PIXI.ticker.shared

  loop.add(updateFunction, gameInstanceReference)

  return loop
}

export default createGameLoop
