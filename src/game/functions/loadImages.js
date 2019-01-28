import * as PIXI from 'pixi.js'

import mountain from '../../images/mountain.png'
import forest from '../../images/forest.png'
import hexagon from '../../images/white.png'

const loadImages = () => {
  return new Promise(resolve => {
    PIXI.loader
      .add('mountain', mountain)
      .add('forest', forest)
      .add('hexagon', hexagon)
      .load(resolve)
  })
}

export default loadImages
