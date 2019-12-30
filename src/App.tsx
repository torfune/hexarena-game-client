import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import store from './store'
import Game from './pages/Game'
import Api, { gsHost } from './Api'
import Socket from './websockets/Socket'
import loadImages from './game/functions/loadImages'
import Spinner from './components/Spinner'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { PRIMARY } from './constants/react'
;(window as any).store = store

const App = observer(() => {
  const [loading, setLoading] = useState<string | null>('')

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
      store.error = `GameServer connection failed`
      return
    }

    // WebSockets
    setLoading('Connecting to server')
    try {
      const host = await gsHost()
      await Socket.connect(host)
    } catch (error) {
      console.error(error)
      store.error = 'WebSocket connection failed'
      return
    }

    // Assets
    setLoading('Loading assets')
    try {
      await loadImages()
    } catch (error) {
      console.error(error)
      store.error = `Asset loading failed`
      return
    }

    setLoading(null)
  }

  const reload = () => {
    console.log(window)
    console.log(window.location)
    window.location.reload()
  }

  const goBack = () => {
    if (window.location.href.includes('localhost')) {
      window.location.href = 'http://localhost:3000'
    } else {
      window.location.href = '/'
    }
  }

  if (store.error) {
    return (
      <div>
        <ErrorMessage>{store.error}</ErrorMessage>
        <ReloadButton onClick={reload}>Try again</ReloadButton>
        <BackButton onClick={goBack}>Back</BackButton>
      </div>
    )
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
})

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
const ErrorMessage = styled.p`
  color: #fff;
  font-size: 24px;
  text-align: center;
  margin-top: 160px;
  margin-bottom: 32px;
  font-weight: 500;
`
const StyledButton = styled.div`
  width: 240px;
  height: 40px;
  margin-bottom: 16px;
  border-radius: 4px;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: 250ms;
  box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 8px;
  justify-content: center;
  margin: 16px auto 0 auto;

  :hover {
    box-shadow: rgba(0, 0, 0, 0.3) 0px 4px 24px;
    transform: scale(1.05);
  }
`
const ReloadButton = styled(StyledButton)`
  background: ${PRIMARY};
`
const BackButton = styled(StyledButton)`
  background: #666;
`

ReactDOM.render(<App />, document.getElementById('root'))
