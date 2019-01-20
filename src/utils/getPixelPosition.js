const getPixelPosition = (x, z, camera, radius) => ({
  x: camera.x + radius * 2 * (Math.sqrt(3) * x + (Math.sqrt(3) / 2) * z),
  y: camera.y + radius * 2 * ((3 / 2) * z),
})

export default getPixelPosition
