import store from '../../store'

class AllianceRequest {
  constructor({ id, senderId, receiverId, timeout }) {
    this.id = id
    this.senderId = senderId
    this.receiverId = receiverId
    this.timeout = timeout

    this.sender = store.getItemById('players', senderId)
    this.receiver = store.getItemById('players', receiverId)
  }
  set(key, value) {
    this[key] = value
  }
}

export default AllianceRequest
