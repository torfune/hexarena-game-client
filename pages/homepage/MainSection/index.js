import Countdown from './Countdown'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'
import PlaySection from './PlaySection'
import Stats from './Stats'
import getGameserverHost from 'utils/getGameserverHost'
import Spinner from 'components/Spinner'

const Container = styled.div`
  margin-top: 80px;
  height: 256px;
  padding: 64px 128px;
  background: #383838;
  display: grid;
  box-shadow: 0px 1px 24px 0px rgba(0, 0, 0, 0.05);
  grid-template-columns: 1fr 1fr;
`

const MainSection = () => {
  const [loading, setLoading] = useState(true)
  const [openingTime, setOpeningTime] = useState(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const GAMESERVER_HOST = getGameserverHost(window.location.hostname)
    const status = await axios.get(`http://${GAMESERVER_HOST}/status`)

    if (status.data.timeRemaining && status.data.timeRemaining > 0) {
      setOpeningTime(status.data.timeRemaining + Date.now())
    }

    setLoading(false)
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
          {/* <Stats /> */}
        </>
      )}
    </Container>
  )
}

export default MainSection
