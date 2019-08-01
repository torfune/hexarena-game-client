import { useEffect, useState } from 'react'
import styled from 'styled-components'
import React from 'react'
import formatTime from '../utils/formatTime'

const Container = styled.div``

let interval: NodeJS.Timeout | null = null

interface Props {
  finishesAt: number
  className?: string
}
const Timer: React.FC<Props> = ({ finishesAt, className }) => {
  const [time, setTime] = useState(0)

  useEffect(() => {
    interval = setInterval(updateTimer, 1000)

    return () => {
      if (interval) {
        clearInterval(interval)
        interval = null
      }
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
