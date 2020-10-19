import hex from './hex'
import { Application } from 'pixi.js-legacy'

const createPixiApp = () => {
  try {
    const pixi = new Application({
      resolution: window.devicePixelRatio,
      autoDensity: true,
    })

    pixi.renderer.backgroundColor = hex('#fff')
    pixi.renderer.autoDensity = true
    pixi.renderer.resize(window.innerWidth, window.innerHeight)

    return pixi
  } catch (error) {
    alert(
      'WebGL is not supported in this browser. The game cannot run without WebGL. I am sorry. You may try different browser.'
    )
    window.location.href = '/'
  }
}

export default createPixiApp
