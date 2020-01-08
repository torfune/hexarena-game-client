const production = process.env.NODE_ENV === 'production'

module.exports = {
  assetPrefix: production ? '/game/' : '',
  env: {
    STATIC: production ? '/game/' : '',
  },
}
