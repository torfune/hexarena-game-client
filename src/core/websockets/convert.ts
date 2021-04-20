import Primitive from '../../types/Primitive'

export type ConvertPrimitiveType = 'string' | 'number' | 'boolean'

const convertPrimitive = (
  payload: string,
  type: ConvertPrimitiveType
): Primitive => {
  // null / false
  if (payload === 'null' || payload === 'undefined' || payload === '') {
    if (type === 'boolean') {
      return false
    } else {
      return null
    }
  }

  // string
  if (!type || type === 'string') {
    return payload
  }

  // number / boolean / unknown type
  switch (type) {
    case 'number':
      const number = Number(payload)
      if (isNaN(number)) {
        return null
      }
      return number
    case 'boolean':
      return payload === 'true' ? true : false
    default:
      return null
  }
}

export default convertPrimitive
