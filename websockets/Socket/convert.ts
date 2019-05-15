const convert = (value: string, type: string) => {
  if (value === 'null' || value === 'undefined' || value === '') {
    if (type === 'bool') {
      return false
    } else {
      return null
    }
  }

  switch (type) {
    case 'number':
      const number = Number(value)

      if (isNaN(number)) {
        console.error(`Can't convert string to a number: ${value}`)
        return null
      }

      return number

    case 'string':
      return String(value)

    case 'bool':
      return value === 'true' ? true : false

    default:
      console.error(`Invalid type: ${type}`)
      return null
  }
}

export default convert
