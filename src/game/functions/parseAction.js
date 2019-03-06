import getTileByXZ from './getTileByXZ'

const parseAction = gsData => {
  let [x, z, duration, finishedAt, ownerId, status, id, type] = gsData.split(
    '|'
  )

  x = Number(x)
  z = Number(z)

  return {
    tile: getTileByXZ(x, z),
    duration: Number(duration),
    finishedAt: finishedAt === 'undefined' ? null : Number(finishedAt),
    ownerId: ownerId === 'null' ? null : ownerId,
    status,
    type,
    id,
  }
}

export default parseAction
