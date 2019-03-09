import * as PIXI from 'pixi.js'

import actionBg from '../../images/action-bg.png'
import actionIconAttack from '../../images/action-icon-attack.png'
import actionIconRecruit from '../../images/action-icon-recruit.png'
import actionIconCut from '../../images/action-icon-cut.png'
import actionIconBuild from '../../images/action-icon-build.png'
import actionIconCancel from '../../images/action-icon-cancel.png'
import actionIconEmpty from '../../images/action-icon-empty.png'
import army from '../../images/army.png'
import armyIcon from '../../images/army-icon.png'
import arrow from '../../images/arrow.png'
import border from '../../images/border.png'
import camp from '../../images/camp.png'
import capital from '../../images/capital.png'
import castle from '../../images/castle.png'
import contested from '../../images/contested.png'
import fog from '../../images/fog.png'
import forest from '../../images/forest.png'
import hitpointsBg from '../../images/hitpoints-bg.png'
import hitpointsFill from '../../images/hitpoints-fill.png'
import mountain from '../../images/mountain.png'
import pattern from '../../images/pattern.png'
import village from '../../images/village.png'
import water from '../../images/water.png'
import blackOverlay from '../../images/black-overlay.png'

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
