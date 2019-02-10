const parseArmy = gsData => {
  const [id, x, z, isDestroyed] = gsData.split('|')

  return {
    id,
    x: Number(x),
    z: Number(z),
    isDestroyed: isDestroyed === 'true',
  }
}

export default parseArmy
