import GameServerMessage from '../../types/GameServerMessage'
import convertObject from '../convertObject'
import convert from '../convert'

type ReturnValue =
  | string
  | boolean
  | number
  | { [key: string]: any }
  | Array<{ [key: string]: any }>
  | null

const parse = (
  payload: string,
  { type, isArray }: GameServerMessage
): ReturnValue => {
  if (!isArray && payload.includes('><')) {
    throw Error(`Error while parsing ${payload} as ${type}.`)
  }

  if (isArray) {
    const items = payload.split('><')
    const result = []

    if (typeof type === 'string') {
      throw Error(`Error while parsing ${payload} as ${type}.`)
    }

    for (let i = 0; i < items.length; i++) {
      if (items[i] === '') continue

      result.push(convertObject(items[i], type))
    }

    return result
  } else {
    if (typeof type === 'object') {
      return convertObject(payload, type)
    } else {
      return convert(payload, type)
    }
  }
}

export default parse
