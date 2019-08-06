const GS = {
  LOCAL: 'localhost:8000',
  DEV: 'us-gs-0.hexarena.io',
  LIVE: 'us-gs-2.hexarena.io',
}

const WS = {
  LOCAL: 'localhost:5000',
  DEV: 'us-ws-0.hexarena.io',
  LIVE: 'us-ws-1.hexarena.io',
}

const getServerHost = (hostname: string = window.location.hostname) => {
  switch (hostname) {
    case 'localhost':
      return {
        GS_HOST: GS.LOCAL,
        WS_HOST: WS.LOCAL,
      }

    case 'dev.hexarena.io':
      return {
        GS_HOST: GS.DEV,
        WS_HOST: WS.DEV,
      }

    case 'hexarena.io':
      return {
        GS_HOST: GS.LIVE,
        WS_HOST: WS.LIVE,
      }

    default:
      return {
        GS_HOST: `${hostname}:8000`,
        WS_HOST: `${hostname}:5000`,
      }
  }
}

export default getServerHost
