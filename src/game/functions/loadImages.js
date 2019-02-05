import * as PIXI from 'pixi.js'

import border from '../../images/border.png'
import capital from '../../images/capital.png'
import castle from '../../images/castle.png'
import fog from '../../images/fog.png'
import forest from '../../images/forest.png'
import mountain from '../../images/mountain.png'
import pattern from '../../images/pattern.png'
import water from '../../images/water.png'

const loadImages = () => {
  return new Promise(resolve => {
    PIXI.loader
      .add('border', border)
      .add('capital', capital)
      .add('castle', castle)
      .add('fog', fog)
      .add('forest', forest)
      .add('mountain', mountain)
      .add('pattern', pattern)
      .add('water', water)
      .load(resolve)
  })
}

export default loadImages
