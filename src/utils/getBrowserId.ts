import { v4 as uuid } from 'uuid'

const getBrowserId = () => {
  let browserId = window.localStorage.getItem('browserId')

  if (!browserId) {
    browserId = uuid()
    window.localStorage.setItem('browserId', browserId)
  }

  return browserId
}

export default getBrowserId
