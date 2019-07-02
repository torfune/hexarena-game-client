const shuffle = <T>(array: T[]) => {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  const shuffledArray = [...array]
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1

    temporaryValue = shuffledArray[currentIndex]
    shuffledArray[currentIndex] = shuffledArray[randomIndex]
    shuffledArray[randomIndex] = temporaryValue
  }

  return shuffledArray
}

export default shuffle
