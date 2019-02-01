import * as PIXI from 'pixi.js'

import mountain from '../../images/mountain.png'
import forest from '../../images/forest.png'
import hexagon from '../../images/white.png'
import castle from '../../images/castle.png'
import capital from '../../images/capital.png'
import water from '../../images/water.png'

const loadImages = () => {
  return new Promise(resolve => {
    PIXI.loader
      .add('mountain', mountain)
      .add('forest', forest)
      .add('hexagon', hexagon)
      .add('castle', castle)
      .add('capital', capital)
      .add('water', water)
      .load(resolve)
  })
}

export default loadImages
