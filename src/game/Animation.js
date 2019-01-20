class Animation {
  constructor({ image, onUpdate }) {
    this.image = image
    this.onUpdate = onUpdate
    this.finished = false
  }
  update = () => {
    this.finished = this.onUpdate(this.image)
  }
}

export default Animation
