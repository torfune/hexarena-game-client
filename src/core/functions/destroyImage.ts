import { Sprite } from 'pixi.js-legacy'
import store from '../store'

const destroyImage = (key: string, image: Sprite) => {
  if (!store.game) return

  const stage = store.game.stage.get(key)
  if (stage) {
    stage.removeChild(image)
  }
}

export default destroyImage
