import Api from '../Api'
import store from '../store'

const getGsHost = async () => {
  if (store.gsHost) {
    return store.gsHost
  }

  const { hostname } = window.location

  let gsHost: string
  switch (hostname) {
    case 'localhost': {
      gsHost = 'localhost:8000'
      break
    }

    case 'dev.hexarena.io': {
      gsHost = 'us-gs-0.hexarena.io'
      break
    }

    case 'hexarena.io': {
      const response = await Api.ws.get('/config/gs-host')
      gsHost = response.data
      break
    }

    default:
      gsHost = `${hostname}:8000`
  }

  console.log(`GS: ${gsHost}`)
  store.gsHost = gsHost
  return gsHost
}

export default getGsHost
