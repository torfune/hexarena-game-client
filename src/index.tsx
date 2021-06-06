import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as Sentry from '@sentry/browser'

let environment = null
switch (window.location.hostname) {
  case 'test.hexarena.io':
    environment = 'test'
    break
  case 'hexarena.io':
    environment = 'production'
    break
}
if (environment) {
  Sentry.init({
    dsn: 'https://28bb77120c0b45a991f6c251a58ffa63@sentry.io/1438180',
    environment,
  })
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
