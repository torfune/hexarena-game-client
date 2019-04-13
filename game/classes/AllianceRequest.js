import store from '../../store'
import { extendObservable } from 'mobx'

class AllianceRequest {
  constructor({ id, senderId, receiverId, timeout }) {
    extendObservable(this, {
      id,
      senderId,
      sender: store.getItem('players', senderId),
      receiverId,
      receiver: store.getItem('players', receiverId),
      timeout,
    })
  }
  set(key, value) {
    this[key] = value
  }
}

export default AllianceRequest
