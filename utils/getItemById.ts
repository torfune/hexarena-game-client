const getItemById = (arr: Array<{ id: string }>, id: string) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return arr[i]
    }
  }

  return null
}

export default getItemById
