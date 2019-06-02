import uuid from 'uuid/v4'

const getBrowserId = () => {
  let browserId = window.localStorage.getItem('browserId')

  if (!browserId) {
    browserId = uuid()
    window.localStorage.setItem('browserId', browserId)
  }

  return browserId
}

export default getBrowserId
