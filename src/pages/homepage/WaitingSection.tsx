import styled from 'styled-components'
import Heading from './Heading'
import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import store from '../../store'
import Spinner from '../../components/Spinner'

const Container = styled.div``

const TimesWrapper = styled.div`
  background: #282828;
  width: 170px;
  padding: 12px 20px;
  border-radius: 4px;
  border: 1px solid #222;
  display: flex;
  justify-content: space-between;
`

const Row = styled.div`
  margin-top: 24px;
  display: flex;
  align-items: center;
`

const Time = styled.p`
  text-align: right;
  color: #fff;
  font-weight: 300;
`

const Label = styled.p`
  text-align: right;
  font-weight: 500;
`

const StyledSpinner = styled(Spinner)`
  margin-left: 20px;
`

const WaitingSection = () => {
  console.log('waiting section re rendered')
  console.log(`store status: ${store.status}`)

  useEffect(() => {
    if (store.status === 'starting' && store.routerHistory) {
      console.log(`status change: ${store.status}`)
      store.routerHistory.push('/game')
    }
  }, [store.status])

  if (!store.waitingTime) return null

  const { current, average, players } = store.waitingTime

  return (
    <Container>
      <Heading>Waiting for other players . . .</Heading>

      <Row>
        <TimesWrapper>
          <div>
            <Label>Current:</Label>
            <Label>Average:</Label>
            <Label>Players:</Label>
          </div>
          <div>
            <Time>{formatTime(current)}</Time>
            <Time>{average ? formatTime(average) : '-'}</Time>
            <Time>{players || '-'}</Time>
          </div>
        </TimesWrapper>

        <StyledSpinner size="40px" thickness="6px" color="#222" />
      </Row>
    </Container>
  )
}

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds - minutes * 60

  const formatted = {
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  }

  return `${formatted.minutes}:${formatted.seconds}`
}

export default observer(WaitingSection)
