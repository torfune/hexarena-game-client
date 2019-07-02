const randomItem = <T>(array: T[]): T | null => {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex] || null
}

export default randomItem
