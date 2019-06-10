import React from 'react'
import styled from 'styled-components'
import LoginSection from './LoginSection'
import GuestSection from './GuestSection'
import { useAuth } from '../../auth'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import WaitingSection from './WaitingSection'
import { HOMEPAGE_BREAKPOINT } from '../../constants/react'
import Profile from './Profile'

const Container = styled.div`
  color: #fff;
  height: 170px;

  @media (max-width: ${HOMEPAGE_BREAKPOINT}) {
    height: 300px;
  }
`

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 500;
`

const Row = styled.div`
  margin-top: 32px;
  display: flex;

  @media (max-width: ${HOMEPAGE_BREAKPOINT}) {
    display: block;
  }
`

const PlaySection = () => {
  const { loggedIn } = useAuth()

  if (loggedIn === null) return <Container />

  return (
    <Container>
      <Heading>Play</Heading>

      {store.waitingTime ? (
        <Row>
          <WaitingSection />
          <Profile />
        </Row>
      ) : (
        <Row>
          <LoginSection />
          {loggedIn ? <Profile /> : <GuestSection />}
        </Row>
      )}
    </Container>
  )
}

export default observer(PlaySection)
