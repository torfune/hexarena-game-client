import styled from 'styled-components'
import TopPlayers from '../../../homepage/TopPlayers'
import store from '../../../../store'
import { observer } from 'mobx-react-lite'
import Players from './Players'
import React from 'react'
import Chat from '../../../homepage/Chat'
import Header from '../../../../components/Header'

const Container = styled.div`
  position: absolute;
  top: 0;
  background: #333;
  width: 66vw;
  height: 100vh;
  padding-left: 64px;
  z-index: 1;
  padding-top: calc(80px + 48px);
  display: flex;
`

const PlayersSection = styled.div`
  width: 100%;
`

interface HeadingProps {
  marginBottom?: string
  center?: boolean
}
const Heading = styled.h2<HeadingProps>`
  color: #fff;
  font-size: 32px;
  font-weight: 500;
  padding-bottom: 24px;
  display: block;
  text-align: ${props => (props.center ? 'center' : 'left')};
`

const Lobby = () => (
  <>
    <Header />
    <Container>
      <TopPlayers fixedHeight="calc(100vh - 300px)" />
      <PlayersSection>
        <Heading>
          {store.startCountdown
            ? `Game starts in ${store.startCountdown} seconds`
            : '. . .'}
        </Heading>
        <Players />
      </PlayersSection>
    </Container>
    <Chat />
  </>
)

export default observer(Lobby)
