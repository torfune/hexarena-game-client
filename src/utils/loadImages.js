import * as PIXI from 'pixi.js'

import mountain from '../images/mountain.png'
import hexagon from '../images/hexagon.png'

const loadImages = () => {
  return new Promise(resolve => {
    PIXI.loader
      .add('mountain', mountain)
      .add('hexagon', hexagon)
      .load(resolve)
  })
}

export default loadImages
