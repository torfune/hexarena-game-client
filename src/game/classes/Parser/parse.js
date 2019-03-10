import convert from './convert'

const parse = (gsData, config) => {
  if (gsData.includes('><')) {
    gsData = gsData.split('><')
  } else {
    gsData = [gsData]
  }

  let result = []

  for (let i = 0; i < gsData.length; i++) {
    if (gsData[i] === '') continue

    const split = gsData[i].split('|')
    const keys = Object.keys(config)
    const obj = {}

    for (let j = 0; j < split.length; j++) {
      obj[keys[j]] = convert(split[j], config[keys[j]])
    }

    result.push(obj)
  }

  return result
}

export default parse
