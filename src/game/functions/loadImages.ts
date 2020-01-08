import { Loader } from 'pixi.js'
import { version } from '../../../package.json'

const loader = Loader.shared
const images = '/game/static/images'

const loadImages = () => {
  return new Promise(resolve => {
    loader
      .add('action-bg', `${images}/action-bg.png?${version}`)
      .add('action-icon-attack', `${images}/action-icon-attack.png?${version}`)
      .add('action-icon-heal', `${images}/action-icon-heal.png?${version}`)
      .add(
        'action-icon-recruit',
        `${images}/action-icon-recruit.png?${version}`
      )
      .add('action-icon-camp', `${images}/action-icon-camp.png?${version}`)
      .add('action-icon-tower', `${images}/action-icon-tower.png?${version}`)
      .add('action-icon-castle', `${images}/action-icon-castle.png?${version}`)
      .add('action-icon-house', `${images}/action-icon-house.png?${version}`)
      .add('army', `${images}/army.png?${version}`)
      .add('unit', `${images}/unit.png?${version}`)
      .add('armyIcon0', `${images}/army-icon-0.png?${version}`)
      .add('armyIcon1', `${images}/army-icon-1.png?${version}`)
      .add('armyIcon2', `${images}/army-icon-2.png?${version}`)
      .add('armyIcon3', `${images}/army-icon-3.png?${version}`)
      .add('armyIcon4', `${images}/army-icon-4.png?${version}`)
      .add('armyIcon5', `${images}/army-icon-5.png?${version}`)
      .add('armyIcon6', `${images}/army-icon-6.png?${version}`)
      .add('armyIconFill', `${images}/army-icon-fill.png?${version}`)
      .add('progressBar', `${images}/progress-bar-bg.png?${version}`)
      .add('progressBarFill', `${images}/progress-bar-fill.png?${version}`)
      .add('capital', `${images}/capital.png?${version}`)
      .add('blackOverlay', `${images}/black-overlay.png?${version}`)
      .add('border', `${images}/border.png?${version}`)
      .add('castle', `${images}/castle.png?${version}`)
      .add('castle-icon', `${images}/castle-icon.png?${version}`)
      .add('forest-icon', `${images}/forest-icon.png?${version}`)
      .add('mountain-icon', `${images}/mountain-icon.png?${version}`)
      .add('village-icon', `${images}/village-icon.png?${version}`)
      .add('tile-icon', `${images}/tile-icon.png?${version}`)
      .add('fog', `${images}/fog.png?${version}`)
      .add('tree', `${images}/tree.png?${version}`)
      .add('gold', `${images}/gold.png?${version}`)
      .add('mountain01', `${images}/mountain01.png?${version}`)
      .add('mountain02', `${images}/mountain02.png?${version}`)
      .add('mountain03', `${images}/mountain03.png?${version}`)
      .add('mountain04', `${images}/mountain04.png?${version}`)
      .add('mountain05', `${images}/mountain05.png?${version}`)
      .add('camp', `${images}/camp.png?${version}`)
      .add('pattern', `${images}/pattern.png?${version}`)
      .add('tower', `${images}/tower.png?${version}`)
      .add('tower-icon', `${images}/tower-icon.png?${version}`)
      .add('house', `${images}/house.png?${version}`)
      .add('hpBackground2', `${images}/hpBackground2.png?${version}`)
      .add('hpBackground3', `${images}/hpBackground3.png?${version}`)
      .add('hpFill', `${images}/hpFill.png?${version}`)
      .add(
        'army-drag-arrow-head',
        `${images}/army-drag-arrow-head.png?${version}`
      )
      .add(
        'army-drag-arrow-body',
        `${images}/army-drag-arrow-body.png?${version}`
      )
      .add('unit-preview-0', `${images}/unit-preview-0.png?${version}`)
      .add('unit-preview-1', `${images}/unit-preview-1.png?${version}`)
      .add('unit-preview-3', `${images}/unit-preview-3.png?${version}`)
      .add('unit-preview-4', `${images}/unit-preview-4.png?${version}`)
      .add(
        'unit-preview-cant-capture',
        `${images}/unit-preview-cant-capture.png?${version}`
      )
      .load(resolve)
  })
}

export default loadImages
