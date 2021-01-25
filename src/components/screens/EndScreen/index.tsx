import { observer } from 'mobx-react-lite'
import { useSpring, animated } from 'react-spring'
import renderWinStatement from './renderWinStatement'
import styled from 'styled-components'
import Table from './Table'
import { PRIMARY, CHAT_WIDTH } from '../../../constants/react'
import getPlayerGroups from '../../../utils/getPlayerGroups'
import store from '../../../core/store'
import React from 'react'
import { Link } from 'react-router-dom'
import getWebClientUrl from '../../../utils/getWebClientUrl'

const Container = styled(animated.div)<{ spectating: boolean }>`
  position: absolute;
  margin-top: ${(props) => (props.spectating ? '60px' : 0)};
  left: 0;
  width: ${(props) =>
    props.spectating ? `calc(100vw - ${CHAT_WIDTH})` : '100vw'};
  height: ${(props) => (props.spectating ? 'calc(100vh - 60px)' : '100vh')};
  background: #00000088;
  border-bottom: 1px solid #222;
  z-index: 11;
  overflow: hidden;
`

const Box = styled.div`
  background: #333;
  padding: 60px 0;
  margin: 0 auto;
  width: 1000px;
  height: 100vh;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  text-align: center;
  box-shadow: 0px 1px 24px #00000033;
  position: relative;
`

const WinStatement = styled.p`
  margin-top: 20px;
  color: #fff;
  text-align: center;
  font-style: italic;

  span {
    color: ${PRIMARY};
    font-weight: 700;
    text-shadow: 0px 1px 6px #00000022;
    font-size: 17px;
    font-style: normal;
  }
`

interface RedSheetProps {
  left?: string
  right?: string
}
const RedSheet = styled.div<RedSheetProps>`
  background: ${PRIMARY};
  width: 56px;
  height: 400px;
  left: ${(props) => props.left};
  right: ${(props) => props.right};
  position: absolute;
  top: -2px;
  box-shadow: 0px 4px 16px #00000033;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`

const Heading = styled.p`
  font-size: 34px;
  font-weight: 700;
  color: #fff;
`

const ContinueButton = styled.div`
  background: ${PRIMARY};
  border-radius: 4px;
  box-shadow: 0px 4px 16px #00000033;
  color: #fff;
  font-size: 20px;
  margin: 60px auto 0 auto;
  padding: 10px 16px;
  transition: 200ms;
  width: 320px;
  font-weight: 600;

  :hover {
    transform: scale(1.05);
  }
`

const EndScreen = () => {
  const spring = useSpring({ top: 0, from: { top: -4000 } })

  if (!store.game || store.game.time === null) return null

  const groups = getPlayerGroups(Array.from(store.game.players.values()))
  const message = store.game.time <= 0 ? `Time's up!` : 'The game has finished!'

  return (
    <Container style={spring} spectating={store.spectating}>
      <Box>
        <Heading>{message}</Heading>
        <WinStatement>{renderWinStatement(groups[0].players)}</WinStatement>

        <Table groups={groups} />

        {store.spectating ? (
          <Link to={getWebClientUrl()}>
            <ContinueButton>Continue</ContinueButton>
          </Link>
        ) : (
          <a href={getWebClientUrl()}>
            <ContinueButton>Continue</ContinueButton>
          </a>
        )}

        <RedSheet left="80px" />
        <RedSheet right="80px" />
      </Box>
    </Container>
  )
}

export default observer(EndScreen)
