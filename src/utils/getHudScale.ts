const getHudScale = () => {
  let hudScale = (window.innerHeight / 2000) * 2
  if (hudScale > 1) {
    hudScale = 1
  }

  return hudScale
}

export default getHudScale
