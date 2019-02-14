import * as PIXI from 'pixi.js'

const createGameLoop = (updateFunction, gameInstanceReference) => {
  const loop = PIXI.ticker.shared

  loop.autoStart = true
  loop.add(updateFunction, gameInstanceReference)

  console.log('Loop created.')

  return loop
}

export default createGameLoop
