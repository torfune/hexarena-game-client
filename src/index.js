import React from 'react'
import ReactDOM from 'react-dom'
import App from './react/App'

const GAMESERVER_URL = process.env.REACT_APP_GAMESERVER_URL

window.onerror = (message, source, line, column) => {
  const data = {
    message,
    source,
    line,
    column,
    userAgent: navigator.userAgent,
  }

  fetch(`${GAMESERVER_URL}/error`, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify(data),
  })
}

ReactDOM.render(<App />, document.getElementById('root'))
