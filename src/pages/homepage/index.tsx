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

const Homepage: React.FC<RouteComponentProps> = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<boolean>(false)
  const [openingTime, setOpeningTime] = useState<number | null>(null)
  const { loggedIn } = useAuth()

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

      setLoading(false)
    } catch (err) {
      console.error(err)
      setError(true)
      setLoading(false)
    }
  }

  if (store.status || loading) return <Header />

  if (error) {
    return (
      <>
        <Header />

        <ErrorMessage>Connection failed.</ErrorMessage>
        <ReloadButton
          onClick={() => {
            window.location.reload()
          }}
        >
          Try again
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
          <PlaySection />
          <Community />
          <ReleaseNotes />
        </div>
      </ContentGrid>

      <Chat />
    </Container>
  )

  // if (loading) {
  //   return <Container />
  // }

  // return (
  //   <Container>
  //     {openingTime ? (
  //       <Countdown openingTime={openingTime} />
  //     ) : (
  //       <>
  //         <LoginSection />
  //         {!loggedIn && <GuestSection />}
  //       </>
  //     )}
  //   </Container>
  // )
}

export default Homepage
