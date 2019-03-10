import React from 'react'
import styled from 'styled-components'

const Container = styled.p`
  color: #fff;
  font-size: 40px;
  font-weight: 700;
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
      {days}:{hours.padStart(2, '0')}:{minutes.padStart(2, '0')}:
      {seconds.padStart(2, '0')}
    </Container>
  )
}

export default Countdown
