import * as PIXI from 'pixi.js'

import hex from './hex'

const createPixiApp = rootElement => {
  const pixi = new PIXI.Application({ resolution: window.devicePixelRatio })

  pixi.renderer.backgroundColor = hex('#fff')
  pixi.renderer.autoResize = true
  pixi.renderer.resize(window.innerWidth, window.innerHeight)

  PIXI.settings.ROUND_PIXELS = true

  rootElement.appendChild(pixi.view)

  return pixi
}

export default createPixiApp
