const getItemById = <T extends { id: string }>(
  array: T[],
  id: string
): T | null => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].id === id) {
      return array[i]
    }
  }

  return null
}

export default getItemById
