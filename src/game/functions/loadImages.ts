import { Loader } from 'pixi.js'

const loader = Loader.shared

const loadImages = () => {
  return new Promise(resolve => {
    loader
      .add('actionBg', '/static/images/action-bg.png?1.26')
      .add('actionIconAttack', '/static/images/action-icon-attack.png?1.26')
      .add('actionIconBuild', '/static/images/action-icon-build.png?1.26')
      .add('actionIconCancel', '/static/images/action-icon-cancel.png?1.26')
      .add('actionIconCut', '/static/images/action-icon-cut.png?1.26')
      .add('actionIconEmpty', '/static/images/action-icon-empty.png?1.26')
      .add('actionIconHeal', '/static/images/action-icon-heal.png?1.26')
      .add('actionIconRecruit', '/static/images/action-icon-recruit.png?1.26')
      .add('army', '/static/images/army.png?1.26')
      .add('armyIcon', '/static/images/army-icon.png?1.26')
      .add('arrow', '/static/images/arrow.png?1.26')
      .add('base', '/static/images/base.png?1.26')
      .add('blackOverlay', '/static/images/black-overlay.png?1.26')
      .add('border', '/static/images/border.png?1.26')
      .add('camp', '/static/images/camp.png?1.26')
      .add('castle', '/static/images/castle.png?1.26')
      .add('castle-icon', '/static/images/castle-icon.png?1.26')
      .add('contested', '/static/images/contested.png?1.26')
      .add('fog', '/static/images/fog.png?1.26')
      .add('forest', '/static/images/forest.png?1.26')
      .add('gold', '/static/images/gold.png?1.26')
      .add('mountain', '/static/images/mountain.png?1.26')
      .add('pattern', '/static/images/pattern.png?1.26')
      .add('tower', '/static/images/tower.png?1.26')
      .add('tower-icon', '/static/images/tower-icon.png?1.26')
      .add('village', '/static/images/village.png?1.26')
      .add('hpBackground2', '/static/images/hpBackground2.png?1.26')
      .add('hpBackground3', '/static/images/hpBackground3.png?1.26')
      .add('hpFill', '/static/images/hpFill.png?1.26')
      .load(resolve)
  })
}

export default loadImages
