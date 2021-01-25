import styled from 'styled-components'
import Spinner from './Spinner'
import { PRIMARY } from '../constants/react'
import shadeColor from '../utils/shade'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import store from '../core/store'
import loadImages from '../core/functions/loadImages'
import Socket from '../core/websockets/Socket'
import { version } from '../../package.json'
import Api, { gsHost } from '../services/Api'
import SoundManager from '../services/SoundManager'
import LocalStorageService from '../services/LocalStorageService'

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

  const initialize = async () => {}

  if (store.loading) {
    return (
      <>
        <Container>
          <StyledSpinner size="96px" thickness="6px" color="#fff" />
        </Container>
      </>
    )
  }

  if (store.error) {
    return (
      <>
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
