import convert from './convert'

const parse = (payload, { type, isArray }) => {
  if (!isArray && payload.includes('><')) {
    console.error(`Error while parsing ${payload} as ${type}.`)
    return
  }

  if (isArray) {
    const items = payload.split('><')
    const result = []

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

const convertObject = (payload, type) => {
  const properties = payload.split('|')
  const keys = Object.keys(type)
  const result = {}

  for (let j = 0; j < properties.length; j++) {
    result[keys[j]] = convert(properties[j], type[keys[j]])
  }

  return result
}

export default parse
