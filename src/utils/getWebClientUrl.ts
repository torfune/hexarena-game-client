function getWebClientUrl() {
  switch (window.location.origin) {
    case 'https://game.hexarena.io':
      return 'https://hexarena.io'

    case 'https://game.test.hexarena.io':
      return 'https://test.hexarena.io'

    case 'http://localhost:4000':
      return 'http://localhost:3000'

    default:
      return 'https://test.hexarena.io'
  }
}

export default getWebClientUrl
