import { Loader } from 'pixi.js'
import { version } from '../../../package.json'

const loader = Loader.shared
const images = '/static/images'

const loadImages = () => {
  return new Promise(resolve => {
    loader
      .add('actionBg', `${images}/action-bg.png?${version}`)
      .add('actionIconAttack', `${images}/action-icon-attack.png?${version}`)
      .add('actionIconBuild', `${images}/action-icon-build.png?${version}`)
      .add('actionIconCancel', `${images}/action-icon-cancel.png?${version}`)
      .add('actionIconCut', `${images}/action-icon-cut.png?${version}`)
      .add('actionIconEmpty', `${images}/action-icon-empty.png?${version}`)
      .add('actionIconHeal', `${images}/action-icon-heal.png?${version}`)
      .add('actionIconRecruit', `${images}/action-icon-recruit.png?${version}`)
      .add('army', `${images}/army.png?${version}`)
      .add('armyIcon', `${images}/army-icon.png?${version}`)
      .add('arrow', `${images}/arrow.png?${version}`)
      .add('base', `${images}/base.png?${version}`)
      .add('blackOverlay', `${images}/black-overlay.png?${version}`)
      .add('border', `${images}/border.png?${version}`)
      .add('castle', `${images}/castle.png?${version}`)
      .add('castle-icon', `${images}/castle-icon.png?${version}`)
      .add('contested', `${images}/contested.png?${version}`)
      .add('fog', `${images}/fog.png?${version}`)
      .add('tree', `${images}/tree.png?${version}`)
      .add('gold', `${images}/gold.png?${version}`)
      .add('mountain', `${images}/mountain.png?${version}`)
      .add('pattern', `${images}/pattern.png?${version}`)
      .add('tower', `${images}/tower.png?${version}`)
      .add('tower-icon', `${images}/tower-icon.png?${version}`)
      .add('village', `${images}/village.png?${version}`)
      .add('hpBackground2', `${images}/hpBackground2.png?${version}`)
      .add('hpBackground3', `${images}/hpBackground3.png?${version}`)
      .add('hpFill', `${images}/hpFill.png?${version}`)
      .load(resolve)
  })
}

export default loadImages
