import styled from 'styled-components'
import Heading from './Heading'
import React from 'react'
import { observer } from 'mobx-react-lite'
import store from '../../store'
import Spinner from '../../components/Spinner'
import Socket from '../../websockets/Socket'
import formatTime from '../../utils/formatTime'

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

const CancelButton = styled.div`
  background: #444;
  border-radius: 4px;
  padding: 6px 0;
  margin-top: 8px;
  border: 1px solid #2f2f2f;
  width: 170px;
  text-align: center;
  font-size: 14px;

  :hover {
    background: #3f3f3f;
  }
`

const WaitingSection = () => {
  if (!store.waitingTime) return null

  const { current, average, players } = store.waitingTime

  const cancelQueue = () => {
    Socket.send('cancelQueue')
  }

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

      <CancelButton onClick={cancelQueue}>Cancel</CancelButton>
    </Container>
  )
}

export default observer(WaitingSection)
