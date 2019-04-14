const getEnvironment = () => {
  switch (window.location.hostname) {
    case 'localhost':
      return 'local'

    case 'dev.hexarena.io':
      return 'development'

    case 'hexarena.io':
      return 'production'

    default:
      return 'unknown-environment'
  }
}

export default getEnvironment
