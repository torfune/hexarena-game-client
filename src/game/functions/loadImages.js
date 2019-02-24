import * as PIXI from 'pixi.js'

import army from '../../images/army.png'
import armyIcon from '../../images/army-icon.png'
import arrow from '../../images/arrow.png'
import border from '../../images/border.png'
import camp from '../../images/camp.png'
import capital from '../../images/capital.png'
import castle from '../../images/castle.png'
import fog from '../../images/fog.png'
import forest from '../../images/forest.png'
import hitpointsBg from '../../images/hitpoints-bg.png'
import hitpointsFill from '../../images/hitpoints-fill.png'
import mountain from '../../images/mountain.png'
import pattern from '../../images/pattern.png'
import village from '../../images/village.png'
import water from '../../images/water.png'
import contested from '../../images/contested.png'

const loadImages = () => {
  return new Promise(resolve => {
    PIXI.loader
      .add('army', army)
      .add('armyIcon', armyIcon)
      .add('arrow', arrow)
      .add('border', border)
      .add('camp', camp)
      .add('capital', capital)
      .add('castle', castle)
      .add('fog', fog)
      .add('forest', forest)
      .add('hitpointsBg', hitpointsBg)
      .add('hitpointsFill', hitpointsFill)
      .add('mountain', mountain)
      .add('pattern', pattern)
      .add('village', village)
      .add('water', water)
      .add('contested', contested)
      .load(resolve)
  })
}

export default loadImages
