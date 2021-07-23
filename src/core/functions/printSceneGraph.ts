export function printSceneGraph(objects: any[], level = 0) {
  let totalCount = 0
  let maskCount = 0
  let spriteMaskCount = 0

  for (const object of objects) {
    totalCount++
    if (object.isMask) {
      maskCount++
      if (object.isSprite) {
        spriteMaskCount++
      }
    }

    if (object.children) {
      const counts = printSceneGraph(object.children, level + 1)
      totalCount += counts[0]
      maskCount += counts[1]
      spriteMaskCount += counts[2]
    }
  }

  if (level === 0) {
    console.log('---- ---- ---- ----')
    console.log('PIXI SCENE INFO:')
    console.log('---- ----')
    console.log('total: ' + totalCount)
    console.log(`masks: ${spriteMaskCount}/${maskCount}`)
  }

  return [totalCount, maskCount, spriteMaskCount]
}
