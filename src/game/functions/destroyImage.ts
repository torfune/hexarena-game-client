import { Sprite } from 'pixi.js'
import store from '../../store'

const destroyImage = (key: string, image: Sprite) => {
  if (store.game) {
    store.game.stage[key].removeChild(image)
  }
}

export default destroyImage
