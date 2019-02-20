import React from 'react'
import styled from 'styled-components'

// import { PRIMARY } from '../../../constants'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #222;
  color: #fff;
  text-align: center;
  padding-top: 96px;

  h1 {
    font-size: 96px;
  }

  h2 {
    font-size: 48px;
  }
`

const Time = styled.h3`
  font-size: 128px;
  margin-top: 128px;
`

const Countdown = ({ time }) => {
  const date = new Date(time)

  let seconds = date.getUTCSeconds()
  let minutes = date.getUTCMinutes()
  let hours = date.getUTCHours()
  let days = date.getUTCDate() - 1

  seconds = String(seconds)
  minutes = String(minutes)
  hours = String(hours)

  return (
    <Container>
      <h1>Hexagor.io</h1>
      <h2>Alpha 1.0.0</h2>

      <Time>
        {days}:{hours.padStart(2, '0')}:{minutes.padStart(2, '0')}:
        {seconds.padStart(2, '0')}
      </Time>
    </Container>
  )
}

export default Countdown
