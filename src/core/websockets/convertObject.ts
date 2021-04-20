import convert, { ConvertPrimitiveType } from './convert'
import Primitive from '../../types/Primitive'

const convertObject = (
  payload: string,
  type: { [key: string]: ConvertPrimitiveType }
) => {
  const values = payload.split('|')
  const keys = Object.keys(type)
  const object: { [key: string]: Primitive } = {}

  for (let j = 0; j < values.length; j++) {
    object[keys[j]] = convert(values[j], type[keys[j]])
  }

  return object
}

export default convertObject
