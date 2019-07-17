import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import LoginSection from './LoginSection'
import GuestSection from './GuestSection'
import { useAuth } from '../../auth'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import WaitingSection from './WaitingSection'
import { HOMEPAGE_BREAKPOINT } from '../../constants/react'
import Profile from './Profile'
import Socket from '../../websockets/Socket'
import getBrowserId from '../../utils/getBrowserId'

const Container = styled.div`
  color: #fff;
  height: 200px;

  @media (max-width: ${HOMEPAGE_BREAKPOINT}) {
    height: 280px;
  }
`

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 500;
`

const Row = styled.div<{ break?: boolean }>`
  margin-top: 32px;
  display: flex;

  ${props =>
    props.break &&
    css`
      @media (max-width: ${HOMEPAGE_BREAKPOINT}) {
        display: block;
      }
    `}
`

const Maintainance = styled.div`
  margin-top: 32px;
  font-size: 18px;
`

const MAINTENANCE = false

const PlaySection = () => {
  const { loggedIn, userId, accessToken } = useAuth()
  const [queryLoaded, setQueryLoaded] = useState(false)

  useEffect(() => {
    if (loggedIn === null) return

    const { href, protocol, pathname, host } = window.location

    const query = href.split('?')[1]
    if (query && query === 'play') {
      if (loggedIn) {
        playAsUser()
      } else {
        playAsGuest()
      }

      const path = `${protocol}//${host}${pathname}`
      window.history.pushState({ path }, '', path)
    }

    setQueryLoaded(true)
  }, [loggedIn])

  const playAsGuest = (name?: string) => {
    if (!name) {
      name = localStorage.getItem('guestName') || ''
    }

    play('playAsGuest', `${getBrowserId()}|${name}`)
  }

  const playAsUser = () => {
    play('playAsUser', `${getBrowserId()}|${userId}|${accessToken}`)
  }

  const play = (message: 'playAsGuest' | 'playAsUser', data: string) => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
    Socket.send(message, data)
    store.waitingTime = {
      current: 0,
      average: 0,
      players: 0,
    }
  }

  if (MAINTENANCE) {
    return (
      <Container>
        <Heading>Maintenance</Heading>
        <Maintainance>Come back in 10 minutes.</Maintainance>
      </Container>
    )
  }

  if (loggedIn === null || !queryLoaded) return <Container />

  return (
    <Container>
      <Heading>Play</Heading>

      {store.waitingTime ? (
        <Row>
          <WaitingSection />
          <Profile />
        </Row>
      ) : (
        <Row break={!loggedIn}>
          <LoginSection play={playAsUser} />
          {loggedIn ? <Profile /> : <GuestSection play={playAsGuest} />}
        </Row>
      )}
    </Container>
  )
}

export default observer(PlaySection)
