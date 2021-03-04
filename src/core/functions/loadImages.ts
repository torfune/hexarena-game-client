import { Loader } from 'pixi.js-legacy'

const loader = Loader.shared
const baseUrl = process.env.PUBLIC_URL + '/images'

const loadImages = () => {
  return new Promise((resolve) => {
    loader.add('spritesheet', `${baseUrl}/spritesheet.json`).load(resolve)
  })
}

export default loadImages
