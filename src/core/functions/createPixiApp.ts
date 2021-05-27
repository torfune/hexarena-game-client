import hex from './hex'
import { Application } from 'pixi.js'
import { Stage } from '../../pixi-layers'
import { BACKGROUND_COLOR } from '../../constants/constants-game'

const createPixiApp = () => {
  try {
    const pixiApp = new Application({
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: window.devicePixelRatio || 1,
      backgroundColor: hex(BACKGROUND_COLOR),
      autoDensity: true,
    })
    pixiApp.stage = new Stage()
    return pixiApp
  } catch (error) {
    alert(
      'WebGL is not supported in this browser. The game cannot run without WebGL. I am sorry. You may try different browser.'
    )
    throw error
  }
}

export default createPixiApp
