const parseTiles = gsData => {
  const gsArray = gsData.includes('><') ? gsData.split('><') : [gsData]
  const gsTiles = []

  for (let i = 0; i < gsArray.length; i++) {
    const gsSplit = gsArray[i].split('|')
    const [
      x,
      z,
      water,
      mountain,
      forest,
      castle,
      ownerId,
      capital,
      village,
      camp,
    ] = gsSplit

    gsTiles.push({
      x: Number(x),
      z: Number(z),
      water: water === 'true',
      mountain: mountain === 'true',
      forest: forest === 'true',
      castle: castle === 'true',
      ownerId: ownerId === 'null' ? null : ownerId,
      capital: capital === 'true',
      village: village === 'true',
      camp: camp === 'true',
    })
  }

  return gsTiles
}

export default parseTiles
