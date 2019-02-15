const parseArmy = gsData => {
  const [id, x, z, ownerId, isDestroyed] = gsData.split('|')

  return {
    id,
    x: Number(x),
    z: Number(z),
    ownerId,
    isDestroyed: isDestroyed === 'true',
  }
}

export default parseArmy
