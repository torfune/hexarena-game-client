const LOCAL = 'localhost:8000'
const DEV = 'us-gs-0.hexarena.io'
const LIVE = 'us-gs-1.hexarena.io'

const getGameserverHost = hostname => {
  switch (hostname) {
    case 'localhost':
      return LOCAL

    case 'dev.hexarena.io':
      return DEV

    case 'hexarena.io':
      return LIVE
  }
}

export default getGameserverHost
