const chance = percentage => {
  const randomNumber = Math.random() * 100
  return randomNumber < percentage
}

export default chance
