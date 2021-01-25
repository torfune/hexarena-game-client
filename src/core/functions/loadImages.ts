import { Loader } from 'pixi.js-legacy'
import { version } from '../../../package.json'

const loader = Loader.shared
const baseUrl = process.env.PUBLIC_URL + '/images'

const loadImages = () => {
  return new Promise((resolve) => {
    loader
      .add('action-bg', `${baseUrl}/action-bg.png?${version}`)
      .add('action-icon-attack', `${baseUrl}/action-icon-attack.png?${version}`)
      .add('action-icon-heal', `${baseUrl}/action-icon-heal.png?${version}`)
      .add(
        'action-icon-recruit',
        `${baseUrl}/action-icon-recruit.png?${version}`
      )
      .add('action-icon-camp', `${baseUrl}/action-icon-camp.png?${version}`)
      .add('action-icon-tower', `${baseUrl}/action-icon-tower.png?${version}`)
      .add('action-icon-castle', `${baseUrl}/action-icon-castle.png?${version}`)
      .add('action-icon-house', `${baseUrl}/action-icon-house.png?${version}`)
      .add('army', `${baseUrl}/army.png?${version}`)
      .add('armyIcon', `${baseUrl}/army-icon.png?${version}`)
      .add('arrow', `${baseUrl}/arrow.png?${version}`)
      .add('capital', `${baseUrl}/capital.png?${version}`)
      .add('blackOverlay', `${baseUrl}/black-overlay.png?${version}`)
      .add('border', `${baseUrl}/border.png?${version}`)
      .add('castle', `${baseUrl}/castle.png?${version}`)
      .add('castle-icon', `${baseUrl}/castle-icon.png?${version}`)
      .add('fog', `${baseUrl}/fog.png?${version}`)
      .add('tree', `${baseUrl}/tree.png?${version}`)
      .add('gold', `${baseUrl}/gold.png?${version}`)
      .add('mountain01', `${baseUrl}/mountain01.png?${version}`)
      .add('mountain02', `${baseUrl}/mountain02.png?${version}`)
      .add('mountain03', `${baseUrl}/mountain03.png?${version}`)
      .add('mountain04', `${baseUrl}/mountain04.png?${version}`)
      .add('mountain05', `${baseUrl}/mountain05.png?${version}`)
      .add('camp', `${baseUrl}/camp.png?${version}`)
      .add('pattern', `${baseUrl}/pattern.png?${version}`)
      .add('tower', `${baseUrl}/tower.png?${version}`)
      .add('tower-icon', `${baseUrl}/tower-icon.png?${version}`)
      .add('house', `${baseUrl}/house.png?${version}`)
      .add('hpBackground2', `${baseUrl}/hpBackground2.png?${version}`)
      .add('hpBackground3', `${baseUrl}/hpBackground3.png?${version}`)
      .add('hpFill', `${baseUrl}/hpFill.png?${version}`)
      .add(
        'army-drag-arrow-head',
        `${baseUrl}/army-drag-arrow-head.png?${version}`
      )
      .add(
        'army-drag-arrow-body',
        `${baseUrl}/army-drag-arrow-body.png?${version}`
      )
      .load(resolve)
  })
}

export default loadImages
