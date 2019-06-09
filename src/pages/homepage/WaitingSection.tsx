import styled from 'styled-components'
import Heading from './Heading'
import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { PRIMARY } from '../../constants/react'
import store from '../../store'
import { withRouter, RouteProps } from 'react-router-dom'
import { RouterProps, RouteComponentProps } from 'react-router'

const Container = styled.div`
  margin-top: 32px;
`

const TimesWrapper = styled.div`
  margin-top: 24px;
  background: #282828;
  width: 170px;
  padding: 12px 20px;
  border-radius: 4px;
  border: 1px solid #222;
  display: flex;
  justify-content: space-between;
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

// interface Props {
//   history: any
// }
const WaitingSection: React.FC<RouteComponentProps> = ({ history }) => {
  if (!store.waitingTime) return null

  const { current, average } = store.waitingTime

  useEffect(() => {
    if (store.status === 'starting') {
      console.log(`status change: ${store.status}`)
      history.push('/game')
    }
  }, [store.status])

  return (
    <Container>
      <Heading>Waiting for other players . . .</Heading>

      <TimesWrapper>
        <div>
          <Label>Current:</Label>
          <Label>Average:</Label>
        </div>
        <div>
          <Time>{formatTime(current)}</Time>
          <Time>{average ? formatTime(average) : '- - : - -'}</Time>
        </div>
      </TimesWrapper>
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

export default withRouter(observer(WaitingSection))
