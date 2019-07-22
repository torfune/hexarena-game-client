import styled from 'styled-components'
import Heading from './Heading'
import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import store from '../../store'
import Spinner from '../../components/Spinner'
import Socket from '../../websockets/Socket'
import formatTime from '../../utils/formatTime'
import { Link } from 'react-router-dom'
import randomItem from '../../utils/randomItem'
import RunningGame from '../../types/RunningGame'
import { PRIMARY } from '../../constants/react'
import shadeColor from '../../utils/shade'

const Container = styled.div``

const TimesWrapper = styled.div`
  background: #282828;
  width: 190px;
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
  width: 190px;
  text-align: center;
  font-size: 14px;

  :hover {
    background: #3f3f3f;
  }
`

const SpectateButton = styled.div`
  display: flex;
  background: ${PRIMARY};
  color: #fff;
  font-weight: 500;
  font-size: 18px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: 200ms;
  height: 45px;
  text-align: center;
  border: 2px solid ${shadeColor(PRIMARY, -20)};
  padding: 0 16px;
  margin-left: 48px;

  > img {
    height: 24px;
    margin-right: 8px;
    filter: invert(1);
  }

  :hover {
    transform: scale(1.05);
  }
`

const WaitingSection = () => {
  const [runningGame, setRunningGame] = useState<RunningGame | null>(null)

  if (!store.waitingTime) return null

  const { current, average, players } = store.waitingTime

  useEffect(() => {
    setRunningGame(randomItem(store.runningGames))
  }, [store.runningGames])

  const cancelQueue = () => {
    Socket.send('cancelQueue')
  }

  return (
    <Container>
      <Heading>Finding match</Heading>

      <Row>
        <TimesWrapper>
          <div>
            <Label>Current:</Label>
            <Label>Estimated:</Label>
            <Label>Players:</Label>
          </div>
          <div>
            <Time>{formatTime(current)}</Time>
            <Time>{average ? formatTime(average) : '-'}</Time>
            <Time>{players || '-'}</Time>
          </div>
        </TimesWrapper>

        <StyledSpinner size="40px" thickness="6px" color="#222" />

        {runningGame && (
          <Link to={`/spectate?game=${runningGame.id}`}>
            <SpectateButton>
              <img src="/static/icons/spectate.svg" />
              <p>Spectate</p>
            </SpectateButton>
          </Link>
        )}
      </Row>

      <CancelButton onClick={cancelQueue}>Cancel</CancelButton>
    </Container>
  )
}

export default observer(WaitingSection)
