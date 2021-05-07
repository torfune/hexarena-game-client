import { Sprite } from 'pixi.js'
import store from '../store'

const destroyImage = (image: Sprite) => {
  if (!store.game || !store.game.pixi) return

  store.game.pixi.stage.removeChild(image)
}

export default destroyImage
