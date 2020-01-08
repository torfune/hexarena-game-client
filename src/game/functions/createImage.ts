import { Sprite, Loader } from 'pixi.js'
import hex from './hex'
import store from '../../store'
import TileImage from '../../types/TileImage'
import TileImageArray from '../../types/TileImageArray'

const loader = Loader.shared

export type CreateImageArgs =
  | [keyof TileImage | keyof TileImageArray, string]
  | (keyof TileImage | keyof TileImageArray)

const createImage = (args: CreateImageArgs) => {
  let stageName: keyof TileImage | keyof TileImageArray
  let textureName: string

  if (typeof args === 'string') {
    stageName = args
    textureName = args
  } else {
    stageName = args[0]
    textureName = args[1]
  }

  if (!store.game) return new Sprite()

  const texture = textureName
    ? loader.resources[textureName].texture
    : loader.resources[stageName].texture

  const image = new Sprite(texture)
  image.anchor.set(0.5, 0.5)

  // Special properties
  if (stageName === 'background') {
    image.tint = hex('#eee')
  }

  if (stageName === 'buildPreview') {
    image.alpha = 0.5
  }

  const stage = store.game.stage.get(stageName)
  if (!stage) return new Sprite()

  stage.addChild(image)
  return image
}

export default createImage
