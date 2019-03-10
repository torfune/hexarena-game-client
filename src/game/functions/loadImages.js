import * as PIXI from 'pixi.js'

import actionBg from '../../assets/images/action-bg.png'
import actionIconAttack from '../../assets/images/action-icon-attack.png'
import actionIconRecruit from '../../assets/images/action-icon-recruit.png'
import actionIconCut from '../../assets/images/action-icon-cut.png'
import actionIconBuild from '../../assets/images/action-icon-build.png'
import actionIconCancel from '../../assets/images/action-icon-cancel.png'
import actionIconEmpty from '../../assets/images/action-icon-empty.png'
import army from '../../assets/images/army.png'
import armyIcon from '../../assets/images/army-icon.png'
import arrow from '../../assets/images/arrow.png'
import border from '../../assets/images/border.png'
import camp from '../../assets/images/camp.png'
import capital from '../../assets/images/capital.png'
import castle from '../../assets/images/castle.png'
import contested from '../../assets/images/contested.png'
import fog from '../../assets/images/fog.png'
import forest from '../../assets/images/forest.png'
import hitpointsBg from '../../assets/images/hitpoints-bg.png'
import hitpointsFill from '../../assets/images/hitpoints-fill.png'
import mountain from '../../assets/images/mountain.png'
import pattern from '../../assets/images/pattern.png'
import village from '../../assets/images/village.png'
import water from '../../assets/images/water.png'
import blackOverlay from '../../assets/images/black-overlay.png'

const loadImages = () => {
  return new Promise(resolve => {
    PIXI.loader
      .add('actionBg', actionBg)
      .add('actionIconAttack', actionIconAttack)
      .add('actionIconRecruit', actionIconRecruit)
      .add('actionIconCut', actionIconCut)
      .add('actionIconBuild', actionIconBuild)
      .add('actionIconCancel', actionIconCancel)
      .add('actionIconEmpty', actionIconEmpty)
      .add('army', army)
      .add('armyIcon', armyIcon)
      .add('arrow', arrow)
      .add('blackOverlay', blackOverlay)
      .add('border', border)
      .add('camp', camp)
      .add('capital', capital)
      .add('castle', castle)
      .add('contested', contested)
      .add('fog', fog)
      .add('forest', forest)
      .add('hitpointsBg', hitpointsBg)
      .add('hitpointsFill', hitpointsFill)
      .add('mountain', mountain)
      .add('pattern', pattern)
      .add('village', village)
      .add('water', water)
      .load(resolve)
  })
}

export default loadImages
