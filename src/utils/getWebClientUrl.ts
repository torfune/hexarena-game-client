function getGameClientUrl() {
  return window.location.href.includes('localhost')
    ? 'http://localhost:3000'
    : 'https://hexarena.io'
}

export default getGameClientUrl
