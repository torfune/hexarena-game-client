import Countdown from './Countdown'
import { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import getServerHost from '../../../utils/getServerHost'
import GuestSection from './GuestSection'
import LoginSection from './LoginSection'
import { useAuth } from '../../../auth'
import React from 'react'
import { PRIMARY, BOX_SHADOW } from '../../../constants/react'
import shadeColor from '../../../utils/shade'

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

const ReloadButton = styled.div`
  background: ${PRIMARY};
  padding: 12px 16px;
  color: #fff;
  margin-top: 16px;
  border-radius: 4px;
  text-align: center;
  width: 200px;
  box-shadow: ${BOX_SHADOW};
  font-weight: 500;

  :hover {
    background: ${shadeColor(PRIMARY, -10)};
  }
`

const MainSection: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [openingTime, setOpeningTime] = useState<number | null>(null)
  const { loggedIn } = useAuth()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const { GS_HOST, WS_HOST } = getServerHost(window.location.hostname)

    try {
      const { data } = await axios.get(`http://${GS_HOST}/status`)
      if (data.timeRemaining && data.timeRemaining > 0) {
        setOpeningTime(data.timeRemaining + Date.now())
      }

      setLoading(false)
    } catch {
      setError(`Can't connect to the game server.`)
    }

    try {
      await axios.get(`http://${WS_HOST}/status`)
    } catch {
      setError(`Can't connect to the web server.`)
    }
  }

  if (error) {
    return (
      <Container>
        <div>
          <ConnectionError>{error}</ConnectionError>
          <ReloadButton
            onClick={() => {
              window.location.reload()
            }}
          >
            Try again
          </ReloadButton>
        </div>
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
          <LoginSection />
          {!loggedIn && <GuestSection />}
        </>
      )}
    </Container>
  )
}

export default MainSection
