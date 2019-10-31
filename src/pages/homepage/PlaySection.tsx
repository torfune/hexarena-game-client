import React from 'react'
import styled from 'styled-components'
import LoginSection from './LoginSection'
import GuestSection from './GuestSection'
import { useAuth } from '../../auth'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import WaitingSection from './WaitingSection'
import { BREAKPOINT } from '../../constants/react'
import Profile from './Profile'
import Socket from '../../websockets/Socket'
import getGuestId from '../../utils/getGuestId'
import LocalStorageManager from '../../LocalStorageManager'

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

const BreakRow = styled.div`
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

const PlaySection = () => {
  const { loggedIn, userId, accessToken } = useAuth()
  // const { user } = store

  const play = () => {
    // const tutorialFinished =
    //   LocalStorageManager.get('tutorialFinished') === 'true' ||
    //   !LocalStorageManager.supported
    // if (!tutorialFinished) {
    //   let guestName = LocalStorageManager.get('guestName')
    //   if (!guestName) {
    //     guestName = `Guest ${Math.floor(Math.random() * 10)}`
    //   }

    //   Socket.send(
    //     'playTutorial',
    //     `${getGuestId()}|${store.user ? store.user.name : guestName}`
    //   )
    //   return
    // }

    const guestName = LocalStorageManager.get('guestName') || ''
    const guestId = getGuestId()

    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
    Socket.send('play', `${userId}|${guestId}|${accessToken}|${guestName}`)
    store.queue = {
      currentTime: 0,
      averageTime: 0,
      playerCount: 0,
    }
  }

  if (loggedIn === null) return <Container />

  return (
    <Container>
      {store.queue ? (
        <BreakRow>
          <WaitingSection />
          <Profile />
        </BreakRow>
      ) : (
        <>
          {loggedIn ? (
            <BreakRow>
              <LoginSection play={play} />
              <Profile />
            </BreakRow>
          ) : (
            <BreakRow>
              <LoginSection play={play} />
              <GuestSection play={play} />
            </BreakRow>
          )}
        </>
      )}
    </Container>
  )
}

export default observer(PlaySection)
