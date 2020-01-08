import { Loader } from 'pixi.js'
import { STATIC } from '../../constants/react'
// import { version } from '../../../package.json'

const loader = Loader.shared
const PATH = `${STATIC}/images`

const loadImages = () => {
  return new Promise(resolve => {
    loader
      .add('action-bg', `${PATH}/action-bg.png`)
      .add('action-icon-attack', `${PATH}/action-icon-attack.png`)
      .add('action-icon-heal', `${PATH}/action-icon-heal.png`)
      .add('action-icon-recruit', `${PATH}/action-icon-recruit.png`)
      .add('action-icon-camp', `${PATH}/action-icon-camp.png`)
      .add('action-icon-tower', `${PATH}/action-icon-tower.png`)
      .add('action-icon-castle', `${PATH}/action-icon-castle.png`)
      .add('action-icon-house', `${PATH}/action-icon-house.png`)
      .add('army', `${PATH}/army.png`)
      .add('unit', `${PATH}/unit.png`)
      .add('armyIcon0', `${PATH}/army-icon-0.png`)
      .add('armyIcon1', `${PATH}/army-icon-1.png`)
      .add('armyIcon2', `${PATH}/army-icon-2.png`)
      .add('armyIcon3', `${PATH}/army-icon-3.png`)
      .add('armyIcon4', `${PATH}/army-icon-4.png`)
      .add('armyIcon5', `${PATH}/army-icon-5.png`)
      .add('armyIcon6', `${PATH}/army-icon-6.png`)
      .add('armyIconFill', `${PATH}/army-icon-fill.png`)
      .add('progressBar', `${PATH}/progress-bar-bg.png`)
      .add('progressBarFill', `${PATH}/progress-bar-fill.png`)
      .add('capital', `${PATH}/capital.png`)
      .add('blackOverlay', `${PATH}/black-overlay.png`)
      .add('border', `${PATH}/border.png`)
      .add('castle', `${PATH}/castle.png`)
      .add('castle-icon', `${PATH}/castle-icon.png`)
      .add('forest-icon', `${PATH}/forest-icon.png`)
      .add('mountain-icon', `${PATH}/mountain-icon.png`)
      .add('village-icon', `${PATH}/village-icon.png`)
      .add('tile-icon', `${PATH}/tile-icon.png`)
      .add('fog', `${PATH}/fog.png`)
      .add('tree', `${PATH}/tree.png`)
      .add('gold', `${PATH}/gold.png`)
      .add('mountain01', `${PATH}/mountain01.png`)
      .add('mountain02', `${PATH}/mountain02.png`)
      .add('mountain03', `${PATH}/mountain03.png`)
      .add('mountain04', `${PATH}/mountain04.png`)
      .add('mountain05', `${PATH}/mountain05.png`)
      .add('camp', `${PATH}/camp.png`)
      .add('pattern', `${PATH}/pattern.png`)
      .add('tower', `${PATH}/tower.png`)
      .add('tower-icon', `${PATH}/tower-icon.png`)
      .add('house', `${PATH}/house.png`)
      .add('hpBackground2', `${PATH}/hpBackground2.png`)
      .add('hpBackground3', `${PATH}/hpBackground3.png`)
      .add('hpFill', `${PATH}/hpFill.png`)
      .add('army-drag-arrow-head', `${PATH}/army-drag-arrow-head.png`)
      .add('army-drag-arrow-body', `${PATH}/army-drag-arrow-body.png`)
      .add('unit-preview-0', `${PATH}/unit-preview-0.png`)
      .add('unit-preview-1', `${PATH}/unit-preview-1.png`)
      .add('unit-preview-3', `${PATH}/unit-preview-3.png`)
      .add('unit-preview-4', `${PATH}/unit-preview-4.png`)
      .add('unit-preview-cant-capture', `${PATH}/unit-preview-cant-capture.png`)
      .load(resolve)
  })
}

export default loadImages
