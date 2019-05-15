const chance = (percentage: number) => {
  const randomNumber = Math.random() * 100
  return randomNumber < percentage
}

export default chance
