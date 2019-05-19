import Countdown from './Countdown'
import { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import PlaySection from './PlaySection'
import Stats from './Stats'
import getServerHost from '../../../utils/getServerHost'

const Container = styled.div`
  margin-top: 80px;
  height: 256px;
  padding: 64px 128px;
  background: #383838;
  display: grid;
  box-shadow: 0px 1px 24px 0px rgba(0, 0, 0, 0.05);
  grid-template-columns: 1fr 1fr;
`

const ConnectionError = styled.p`
  color: #fff;
  font-size: 20px;
  margin-top: 32px;
`

const MainSection: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [connectionError, setConnectionError] = useState(false)
  const [openingTime, setOpeningTime] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const { GS_HOST } = getServerHost(window.location.hostname)

      const { data } = await axios.get(`http://${GS_HOST}/status`)

      if (data.timeRemaining && data.timeRemaining > 0) {
        setOpeningTime(data.timeRemaining + Date.now())
      }

      setLoading(false)
    } catch {
      console.error(`Can't connect to the GameServer.`)
      setConnectionError(true)
    }
  }

  if (connectionError) {
    return (
      <Container>
        <ConnectionError>Can't connect to the GameSever :(</ConnectionError>
      </Container>
    )
  }

  if (loading) {
    return <Container />
  }

  return (
    <Container>
      {openingTime ? (
        <Countdown openingTime={openingTime} />
      ) : (
        <>
          <PlaySection />
          <Stats />
        </>
      )}
    </Container>
  )
}

export default MainSection
