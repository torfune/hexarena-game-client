import store from '../../store'

class AllianceRequest {
  constructor({ id, senderId, receiverId, timeout }) {
    this.id = id
    this.senderId = senderId
    this.receiverId = receiverId
    this.timeout = timeout

    this.sender = store.getItem('players', senderId)
    this.receiver = store.getItem('players', receiverId)
  }
  set(key, value) {
    this[key] = value
  }
}

export default AllianceRequest
