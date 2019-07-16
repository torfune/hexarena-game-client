import styled from 'styled-components'
import Spinner from './Spinner'
import { PRIMARY } from '../constants/react'
import shadeColor from '../utils/shade'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import store from '../store'
import getServerHost from '../utils/getServerHost'
import loadImages from '../game/functions/loadImages'
import Header from './Header'
import Socket from '../websockets/Socket'
import { version } from '../../package.json'
import Api from '../Api'

const Container = styled.div`
  margin-top: 200px;
`

const StyledSpinner = styled(Spinner)`
  margin: 256px auto;
`

const ErrorMessage = styled.p`
  color: #fff;
  text-align: center;
  font-size: 24px;
`

const ReloadButton = styled.div`
  display: flex;
  background: ${PRIMARY};
  color: #fff;
  font-weight: 500;
  font-size: 20px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: 200ms;
  width: 200px;
  height: 45px;
  text-align: center;
  border: 2px solid ${shadeColor(PRIMARY, -20)};
  margin: 64px auto;

  :hover {
    transform: scale(1.05);
  }
`

const Loader: React.FC = () => {
  store.routerHistory = history

  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    try {
      // GameServer status
      const { data: status } = await Api.gs.get('/status')

      const gsVersion = status.version.slice(0, 4)
      const feVersion = version.slice(0, 4)

      if (gsVersion !== feVersion) {
        // Try reload to get latest version
        const lastVersionReloaded = localStorage.getItem('lastVersionReloaded')
        if (lastVersionReloaded !== feVersion) {
          localStorage.setItem('lastVersionReloaded', feVersion)
          window.location.reload()
          return
        }

        store.error = {
          message: `Client and server version doesn't match. Client: ${version} | Server: ${
            status.version
          }`,
          goHome: true,
        }
      }

      if (status.timeRemaining && status.timeRemaining > 0) {
        store.openingTime = status.timeRemaining + Date.now()
      }

      // GameServer config
      const { data: config } = await Api.gs.get(`/config`)
      store.gsConfig = config

      // WebServer status
      await Api.ws.get('/status')

      // Socket connection
      const { GS_HOST } = getServerHost()
      await Socket.connect(GS_HOST)

      // Load images
      await loadImages()

      store.loading = false
    } catch (err) {
      console.error(err)

      store.loading = false
      store.error = {
        message: 'Connection failed.',
      }
    }
  }

  if (store.loading) {
    return (
      <>
        <Header />
        <Container>
          <StyledSpinner size="96px" thickness="6px" color="#fff" />
        </Container>
      </>
    )
  }

  if (store.error) {
    return (
      <>
        <Header />
        <Container>
          <ErrorMessage>
            {store.error && store.error.message
              ? store.error.message
              : 'Connection failed.'}
          </ErrorMessage>
          <ReloadButton
            onClick={() => {
              window.location.reload()
            }}
          >
            Reconnect
          </ReloadButton>
        </Container>
      </>
    )
  }

  return null
}

export default observer(Loader)
