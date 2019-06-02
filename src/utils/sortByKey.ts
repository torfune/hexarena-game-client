interface IndexSignature {
  [key: string]: any
}

const sortByKey = <T>(arr: T[], key: string): T[] => {
  return [...arr].sort((a: IndexSignature, b: IndexSignature) => {
    if (a[key] > b[key]) {
      return -1
    } else if (a[key] < b[key]) {
      return 1
    } else {
      return 0
    }
  })
}

export default sortByKey
