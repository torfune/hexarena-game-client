import * as PIXI from 'pixi.js'

const createGameLoop = (updateFunction, gameInstanceReference) => {
  const loop = PIXI.ticker.shared

  loop.add(updateFunction, gameInstanceReference)

  return loop
}

export default createGameLoop
