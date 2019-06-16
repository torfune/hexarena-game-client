import { Sprite } from 'pixi.js'
import store from '../../store'

const destroyImage = (key: string, image: Sprite) => {
  store.game.stage[key].removeChild(image)
}

export default destroyImage
