import hex from './hex'
import { Application } from 'pixi.js'

const createPixiApp = () => {
  const pixi = new Application({
    resolution: window.devicePixelRatio,
    autoDensity: true,
    antialias: true,
  })

  pixi.renderer.backgroundColor = hex('#fff')
  pixi.renderer.autoResize = true
  pixi.renderer.resize(window.innerWidth, window.innerHeight)

  return pixi
}

export default createPixiApp
