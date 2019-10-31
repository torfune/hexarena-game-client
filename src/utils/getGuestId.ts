import { v4 as uuid } from 'uuid'
import LocalStorageManager from '../LocalStorageManager'

const getGuestId = () => {
  let guestId = LocalStorageManager.get('guestId')
  if (!guestId) {
    guestId = uuid()
    LocalStorageManager.set('guestId', guestId)
  }

  return guestId
}

export default getGuestId
