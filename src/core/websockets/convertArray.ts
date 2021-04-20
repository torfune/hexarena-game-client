import convertObject from './convertObject'
import convert, { ConvertPrimitiveType } from './convert'

const convertArray = (
  payload: string,
  type: ConvertPrimitiveType | { [key: string]: ConvertPrimitiveType }
) => {
  const items = payload.split('><')
  const array = []

  for (let i = 0; i < items.length; i++) {
    if (items[i] === '') continue

    if (typeof type === 'string') {
      array.push(convert(items[i], type))
    } else {
      array.push(convertObject(items[i], type))
    }
  }

  return array
}

export default convertArray
