import { v4 as uuid } from 'uuid'
import LocalStorageManager from '../LocalStorageManager'

const getBrowserId = () => {
  let browserId = LocalStorageManager.get('browserId')

  if (!browserId) {
    browserId = uuid()
    LocalStorageManager.set('browserId', browserId)
  }

  return browserId
}

export default getBrowserId
