const convert = (value, type) => {
  if (value === 'null' || value === 'undefined' || value === '') {
    return null
  }

  switch (type) {
    case 'number':
      const number = Number(value)

      if (isNaN(number)) {
        console.error(`Can't convert to Number: ${value}`)
        return null
      }

      return number

    case 'string':
      return String(value)

    case 'bool':
      return value === 'true' ? true : false
  }
}

export default convert
