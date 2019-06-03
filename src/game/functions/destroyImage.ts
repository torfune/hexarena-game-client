import game from '../../game'
import { Sprite } from 'pixi.js'

const destroyImage = (key: string, image: Sprite) => {
  game.stage[key].removeChild(image)
}

export default destroyImage
