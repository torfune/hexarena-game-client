import styled from 'styled-components'
import React, { useEffect } from 'react'
import Header from '../../components/Header'
import { version } from '../../../package.json'
import PlaySection from './PlaySection'
import Chat from './Chat'
import store from '../../store'
import Community from './Community'
import TopPlayers from './TopPlayers'
import Countdown from './Countdown'
import { observer } from 'mobx-react-lite'
import { History } from 'history'
import MatchFound from '../../components/MatchFound'
import Socket from '../../websockets/Socket'
import Changelog from './Changelog'
import { CHAT_WIDTH, BREAKPOINT } from '../../constants/react'
import GameList from './GameList'

const Container = styled.div`
  padding-bottom: 128px;
`

const Grid = styled.div`
  width: calc(100vw - ${CHAT_WIDTH} - 310px);
  padding-top: calc(48px + 60px);
  padding-left: 48px;
  padding-right: 96px;
  display: grid;
  grid-template-columns: 270px auto;
  grid-column-gap: 96px;

  @media (max-width: ${BREAKPOINT.MAIN_2}) {
    grid-template-columns: auto;
  }

  @media (max-width: ${BREAKPOINT.HIDE_CHAT}) {
    grid-template-columns: 270px auto;
    width: calc(100vw - 310px);
  }

  @media (max-width: ${BREAKPOINT.MAIN_4}) {
    grid-template-columns: auto;
  }

  @media (max-width: ${BREAKPOINT.FINAL}) {
    width: 100vw;
    padding-left: 64px;
    padding-right: 64px;
    display: flex;
    align-items: center;
    flex-direction: column-reverse;
  }
`

const Row = styled.div`
  display: flex;
  z-index: 1;
  position: relative;
  width: calc(100vw - ${CHAT_WIDTH});

  @media (max-width: ${BREAKPOINT.HIDE_CHAT}) {
    width: calc(100vw);
  }

  @media (max-width: ${BREAKPOINT.FINAL}) {
    flex-direction: column;
    align-items: center;
  }
`

const OFFSET = '400px'
const Screenshot = styled.div`
  position: absolute;
  top: 0;
  left: -${OFFSET};
  opacity: 0.045;
  z-index: 0;
  width: calc(100vw + ${OFFSET});
  height: 4000px;
  background: url(${`/static/images/screenshot.png?${version}`});

  @media (max-width: ${BREAKPOINT.FINAL}) {
    display: none;
  }
`

interface Props {
  history: History
}
const Homepage: React.FC<Props> = ({ history }) => {
  store.routerHistory = history

  useEffect(() => {
    if (store.game) {
      store.game.destroy()
      store.spectating = false
      Socket.send('stopSpectate')
    }
  }, [])

  return (
    <Container>
      <Header />

      <Row>
        <Grid>
          <TopPlayers />
          {store.openingTime ? (
            <Countdown openingTime={store.openingTime} />
          ) : (
            <PlaySection />
          )}
          <Community />
          <Changelog />
          <MatchFound />
        </Grid>
        <GameList />
      </Row>

      <Screenshot />
      <Chat />
    </Container>
  )
}

export default observer(Homepage)
