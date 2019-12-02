import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import store from './store'
import Game from './pages/Game'
import Api, { gsHost } from './Api'
import Socket from './websockets/Socket'
import loadImages from './game/functions/loadImages'
import Spinner from './components/Spinner'
import styled from 'styled-components'
;(window as any).store = store

const App = () => {
  const [loading, setLoading] = useState<string | null>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    // Configuration
    setLoading('Loading configuration')
    try {
      store.config = await Api.getConfig()
    } catch (error) {
      console.error(error)
      setError(`GameServer connection failed`)
      return
    }

    // WebSockets
    setLoading('Connecting to server')
    try {
      const host = await gsHost()
      await Socket.connect(host)
    } catch (error) {
      console.error(error)
      setError('WebSocket connection failed')
      return
    }

    // Assets
    setLoading('Loading assets')
    try {
      await loadImages()
    } catch (error) {
      console.error(error)
      setError(`Asset loading failed`)
      return
    }

    setLoading(null)
  }

  if (error) {
    return <p style={{ color: '#fff' }}>{error}</p>
  }

  if (loading !== null) {
    return (
      <Loader>
        <Spinner size="64px" thickness="4px" color="#fff" />
        <p>{loading}</p>
      </Loader>
    )
  }

  return <Game />
}

const Loader = styled.div`
  margin-top: 128px;
  display: flex;
  flex-direction: column;
  align-items: center;

  > p {
    margin-top: 32px;
    font-weight: 500;
    font-size: 18px;
  }
`

ReactDOM.render(<App />, document.getElementById('root'))
