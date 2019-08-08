import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import LoginSection from './LoginSection'
import GuestSection from './GuestSection'
import { useAuth } from '../../auth'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import WaitingSection from './WaitingSection'
import { BREAKPOINT } from '../../constants/react'
import Profile from './Profile'
import Socket from '../../websockets/Socket'
import getBrowserId from '../../utils/getBrowserId'

const Container = styled.div`
  color: #fff;
  width: 100%;

  @media (max-width: ${BREAKPOINT.MAIN_2}) {
    grid-row: 1;
    grid-column: 1;
  }

  @media (max-width: ${BREAKPOINT.HIDE_CHAT}) {
    grid-column: 2;
  }

  @media (max-width: ${BREAKPOINT.MAIN_4}) {
    grid-column: 1;
  }

  @media (max-width: ${BREAKPOINT.FINAL}) {
    display: none;
  }
`

const Heading = styled.h2`
  font-size: 28px;
  font-weight: 500;
`

const Row = styled.div`
  margin-top: 32px;
  display: flex;
`

const BreakRow = styled.div`
  margin-top: 32px;
  display: flex;

  @media (max-width: ${BREAKPOINT.MAIN_1}) {
    display: block;
  }

  @media (max-width: ${BREAKPOINT.MAIN_2}) {
    display: flex;
  }

  @media (max-width: ${BREAKPOINT.MAIN_3}) {
    display: block;
  }

  @media (max-width: ${BREAKPOINT.MAIN_4}) {
    display: flex;
  }

  @media (max-width: ${BREAKPOINT.MAIN_5}) {
    display: block;
  }
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
    const { normal, ranked } = store.queueSettings
    play(
      'playAsUser',
      `${getBrowserId()}|${userId}|${accessToken}|${normal}|${ranked}`
    )
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
        <BreakRow>
          <WaitingSection />
          <Profile />
        </BreakRow>
      ) : (
        <>
          {loggedIn ? (
            <BreakRow>
              <LoginSection play={playAsUser} />
              <Profile />
            </BreakRow>
          ) : (
            <BreakRow>
              <LoginSection play={playAsUser} />
              <GuestSection play={playAsGuest} />
            </BreakRow>
          )}
        </>
      )}
    </Container>
  )
}

export default observer(PlaySection)
