const getWsHost = () => {
  const { hostname } = window.location

  switch (hostname) {
    case 'localhost':
      return 'localhost:5000'

    case 'dev.hexarena.io':
      return 'us-ws-0.hexarena.io'

    case 'hexarena.io':
      return 'us-ws-1.hexarena.io'

    default:
      return `${hostname}:5000`
  }
}

export default getWsHost
