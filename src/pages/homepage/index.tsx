import styled from 'styled-components'
import React, { useEffect } from 'react'
import Header from '../../components/Header'
import PlaySection from './PlaySection'
import Chat from './Chat'
import store from '../../store'
import Community from './Community'
import TopPlayers from './TopPlayers'
import Countdown from './Countdown'
import { observer } from 'mobx-react-lite'
import { History } from 'history'
import RunningGames from './RunningGames'
import MatchFound from '../../components/MatchFound'
import HowToPlay from './HowToPlay'
import Socket from '../../websockets/Socket'
import Changelog from './Changelog'
import { CHAT_WIDTH, BREAKPOINT } from '../../constants/react'
import GameList from './GameList'

const Container = styled.div`
  padding-bottom: 128px;
`

const Grid = styled.div`
  width: calc(100vw - ${CHAT_WIDTH} - 310px);
  padding-top: calc(48px + 80px);
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

  @media (max-width: ${BREAKPOINT.FINAL}) {
    flex-direction: column;
    align-items: center;
  }
`

// const InnerGrid = styled.div`
//   display: grid;
//   grid-template-columns: auto 400px;
//   grid-column-gap: 80px;
// `

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
          <HowToPlay />
          <Changelog />
          <MatchFound />
        </Grid>
        <GameList />
      </Row>

      <Chat />
    </Container>
  )
}

export default observer(Homepage)
