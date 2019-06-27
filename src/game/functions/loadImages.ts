import { Loader } from 'pixi.js'

const loader = Loader.shared

const loadImages = () => {
  return new Promise(resolve => {
    loader
      .add('actionBg', '/static/images/action-bg.png')
      .add('actionIconAttack', '/static/images/action-icon-attack.png')
      .add('actionIconBuild', '/static/images/action-icon-build.png')
      .add('actionIconCancel', '/static/images/action-icon-cancel.png')
      .add('actionIconCut', '/static/images/action-icon-cut.png')
      .add('actionIconEmpty', '/static/images/action-icon-empty.png')
      .add('actionIconHeal', '/static/images/action-icon-heal.png')
      .add('actionIconRecruit', '/static/images/action-icon-recruit.png')
      .add('army', '/static/images/army.png')
      .add('armyIcon', '/static/images/army-icon.png')
      .add('arrow', '/static/images/arrow.png')
      .add('base', '/static/images/base.png')
      .add('blackOverlay', '/static/images/black-overlay.png')
      .add('border', '/static/images/border.png')
      .add('camp', '/static/images/camp.png')
      .add('castle', '/static/images/castle.png')
      .add('castle-icon', '/static/images/castle-icon.png')
      .add('contested', '/static/images/contested.png')
      .add('fog', '/static/images/fog.png')
      .add('forest', '/static/images/forest.png')
      .add('gold', '/static/images/gold.png')
      .add('mountain', '/static/images/mountain.png')
      .add('pattern', '/static/images/pattern.png')
      .add('tower', '/static/images/tower.png')
      .add('tower-icon', '/static/images/tower-icon.png')
      .add('village', '/static/images/village.png')
      .add('hpBackground2', '/static/images/hpBackground2.png')
      .add('hpBackground3', '/static/images/hpBackground3.png')
      .add('hpFill', '/static/images/hpFill.png')
      .load(resolve)
  })
}

export default loadImages
