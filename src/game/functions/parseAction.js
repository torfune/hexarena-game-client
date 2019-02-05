const parseAction = gsData => {
  const [x, z, duration, finishedAt, ownerId, destroyed] = gsData.split('|')

  return {
    x: Number(x),
    z: Number(z),
    duration: Number(duration),
    finishedAt: Number(finishedAt),
    ownerId: ownerId === 'null' ? null : ownerId,
    destroyed: destroyed === 'true',
  }
}

export default parseAction
