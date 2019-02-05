const parseAction = gsData => {
  const [x, z, duration, finishedAt, canceledAt, ownerId] = gsData.split('|')

  return {
    x: Number(x),
    z: Number(z),
    duration: Number(duration),
    finishedAt: Number(finishedAt),
    canceledAt: Number(canceledAt),
    ownerId: ownerId === 'null' ? null : ownerId,
  }
}

export default parseAction
