import styled from 'styled-components'
import React, { useState, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import Header from '../../components/Header'
import Axios from 'axios'
import getServerHost from '../../utils/getServerHost'
import { useAuth } from '../../auth'
import PlaySection from './PlaySection'
import Chat from './Chat'
import store from '../../store'
import Socket from '../../websockets/Socket'
import Community from './Community'
import ReleaseNotes from './ReleaseNotes'
import TopPlayers from './TopPlayers'
import { PRIMARY } from '../../constants/react'
import shadeColor from '../../utils/shade'
import Countdown from './Countdown'
import { observer } from 'mobx-react-lite'
import { History } from 'history'
import loadImages from '../../game/functions/loadImages'
import { version } from '../../../package.json'

const Container = styled.div``

const ContentGrid = styled.div`
  display: flex;
  width: 66vw;
  padding-top: calc(48px + 80px);
  padding-left: 64px;
`

const ErrorMessage = styled.p`
  color: #fff;
  text-align: center;
  margin-top: 200px;
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

interface Props {
  history: History
}
const Homepage: React.FC<Props> = ({ history }) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<boolean>(false)
  const [openingTime, setOpeningTime] = useState<number | null>(null)

  store.routerHistory = history

  useEffect(() => {
    if (store.status) {
      window.location.reload()
    }

    fetchData()
  }, [])

  const fetchData = async () => {
    const { GS_HOST, WS_HOST } = getServerHost(window.location.hostname)

    try {
      // GameServer status
      const { data: status } = await Axios.get(`http://${GS_HOST}/status`)

      if (status.version.slice(0, 4) !== version.slice(0, 4)) {
        store.error = {
          message: `Client and server version doesn't match. Client: ${version} | Server: ${
            status.version
          }`,
          goHome: true,
        }
      }

      if (status.timeRemaining && status.timeRemaining > 0) {
        setOpeningTime(status.timeRemaining + Date.now())
      }

      // GameServer config
      const { data: config } = await Axios.get(`http://${GS_HOST}/config`)
      store.gsConfig = config

      // WebServer status
      await Axios.get(`http://${WS_HOST}/status`)

      // Socket connection
      await Socket.connect(GS_HOST)

      // Load images
      await loadImages()

      setLoading(false)
    } catch (err) {
      console.error(err)
      setError(true)
      setLoading(false)
    }
  }

  if (loading) return <Header />

  if (error || store.error) {
    return (
      <>
        <Header />

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
      </>
    )
  }

  return (
    <Container>
      <Header />

      <ContentGrid>
        <TopPlayers />
        <div>
          {openingTime ? (
            <Countdown openingTime={openingTime} />
          ) : (
            <PlaySection />
          )}
          <Community />
          <ReleaseNotes />
        </div>
      </ContentGrid>

      <Chat />
    </Container>
  )
}

export default observer(Homepage)
