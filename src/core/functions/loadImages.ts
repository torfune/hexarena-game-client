import { Loader } from 'pixi.js'

const BASE_URL = process.env.PUBLIC_URL + '/images'

async function loadImages() {
  return new Promise<void>((resolve) => {
    Loader.shared
      .add('spritesheet', `${BASE_URL}/spritesheet.json`)
      .load(resolve)
  })
}

export default loadImages
