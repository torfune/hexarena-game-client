import styled from 'styled-components'
import Spinner from './Spinner'
import { PRIMARY } from '../constants/react'
import shadeColor from '../utils/shade'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import store from '../store'
import loadImages from '../game/functions/loadImages'
import Header from './Header'
import Socket from '../websockets/Socket'
import { version } from '../../package.json'
import Api, { gsHost } from '../Api'
import SoundManager from '../SoundManager'
import LocalStorageManager from '../LocalStorageManager'

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
  useEffect(() => {
    initialize()
  }, [])

  const initialize = async () => {
    try {
      const [statusRes, configRes] = await Promise.all([
        Api.gs.get('/status'),
        Api.gs.get(`/config`),
        Api.ws.get('/status'),
      ])

      // Version check
      const gsVersion = statusRes.data.version.slice(0, 4)
      const feVersion = version.slice(0, 4)
      if (gsVersion !== feVersion) {
        const lastVersionReloaded = LocalStorageManager.get(
          'lastVersionReloaded'
        )
        if (lastVersionReloaded !== feVersion) {
          LocalStorageManager.set('lastVersionReloaded', feVersion)
          window.location.reload()
          return
        }
        store.error = {
          message: `Client and server version doesn't match. Client: ${version} | Server: ${statusRes.data.version}`,
          goHome: true,
        }
      }

      // GameServer config
      store.gsConfig = configRes.data

      // Socket connection
      const host = await gsHost()
      await Socket.connect(host)

      // Load images
      await loadImages()

      // Load sounds
      SoundManager.init()

      // Local storage
      store.settings.sound = LocalStorageManager.get('soundEnabled') === 'true'

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
