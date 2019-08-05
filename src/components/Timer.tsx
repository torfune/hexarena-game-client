import { useEffect, useState } from 'react'
import styled from 'styled-components'
import React from 'react'
import formatTime from '../utils/formatTime'

const Container = styled.div``

interface Props {
  finishesAt: number
  className?: string
}
const Timer: React.FC<Props> = ({ finishesAt, className }) => {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(updateTimer, 1000)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const updateTimer = () => {
    const now = Date.now()
    const time = Math.round((finishesAt - now) / 1000)
    setTime(time)
  }

  return (
    <Container className={className}>
      {time ? formatTime(time) : null}
    </Container>
  )
}

export default Timer
