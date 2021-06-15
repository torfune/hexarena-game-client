import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as Sentry from '@sentry/browser'

let environment = null
switch (window.location.hostname) {
  case 'game.test.hexarena.io':
    environment = 'test'
    break
  case 'game.hexarena.io':
    environment = 'production'
    break
}
if (environment) {
  console.log(`Initializing Sentry for ${environment} environment.`)
  Sentry.init({
    dsn: 'https://28bb77120c0b45a991f6c251a58ffa63@sentry.io/1438180',
    environment,
  })
} else {
  console.log(`Sentry initialization skipped. Valid environment not found.`)
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
