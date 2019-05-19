const GS = {
  LOCAL: 'localhost:8000',
  DEV: 'us-gs-0.hexarena.io',
  LIVE: 'us-gs-1.hexarena.io',
}

const WS = {
  LOCAL: 'localhost:5000',
  DEV: 'us-ws-0.hexarena.io',
  LIVE: 'us-ws-1.hexarena.io',
}

const getServerHost = (hostname: string) => {
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
      throw Error(`Invalid hostname: ${hostname}`)
  }
}

export default getServerHost
