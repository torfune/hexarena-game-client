import { v4 as uuid } from 'uuid'
import Storage from '../Storage'

const getGuestId = () => {
  let guestId = Storage.get('guestId')
  if (!guestId) {
    guestId = uuid()
    Storage.set('guestId', guestId)
  }

  return guestId
}

export default getGuestId
