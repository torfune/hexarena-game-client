import { Sprite } from 'pixi.js-legacy'
import store from '../store'

const destroyImage = (key: string, image: Sprite) => {
  if (!store.game || !store.game.pixi) return

  store.game.pixi.stage.removeChild(image)
}

export default destroyImage
