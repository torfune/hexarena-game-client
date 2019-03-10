import * as PIXI from 'pixi.js'
import hex from './hex'

const createPixiApp = () => {
  const pixi = new PIXI.Application({ resolution: window.devicePixelRatio })

  pixi.renderer.backgroundColor = hex('#fff')
  pixi.renderer.autoResize = true
  pixi.renderer.resize(window.innerWidth, window.innerHeight)

  PIXI.settings.ROUND_PIXELS = true

  return pixi
}

export default createPixiApp
