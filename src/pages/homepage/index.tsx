import styled from 'styled-components'
import React from 'react'
import Header from '../../components/Header'
import PlaySection from './PlaySection'
import Chat from './Chat'
import store from '../../store'
import Community from './Community'
import ReleaseNotes from './ReleaseNotes'
import TopPlayers from './TopPlayers'
import Countdown from './Countdown'
import { observer } from 'mobx-react-lite'
import { History } from 'history'
import RunningGames from './RunningGames'
import MatchFound from '../../components/MatchFound'
import HowToPlay from './HowToPlay'

const Container = styled.div``

const ContentGrid = styled.div`
  display: flex;
  width: 66vw;
  padding-top: calc(48px + 80px);
  padding-left: 64px;
`

interface Props {
  history: History
}
const Homepage: React.FC<Props> = ({ history }) => {
  store.routerHistory = history

  return (
    <Container>
      <Header />

      <ContentGrid>
        <TopPlayers />
        <div>
          {store.openingTime ? (
            <Countdown openingTime={store.openingTime} />
          ) : (
            <PlaySection />
          )}
          <RunningGames />
          <Community />
          <HowToPlay />
          <ReleaseNotes />
          <MatchFound />
        </div>
      </ContentGrid>

      <Chat />
    </Container>
  )
}

export default observer(Homepage)
