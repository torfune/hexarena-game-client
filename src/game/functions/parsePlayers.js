const parsePlayers = gsData => {
  const gsArray = gsData.includes('><') ? gsData.split('><') : [gsData]
  const gsPlayers = []

  for (let i = 0; i < gsArray.length; i++) {
    const [id, name, pattern, tilesCount] = gsArray[i].split('|')

    gsPlayers.push({ id, name, pattern, tilesCount })
  }

  return gsPlayers
}

export default parsePlayers
