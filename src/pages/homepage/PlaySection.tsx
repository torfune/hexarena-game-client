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
import getBrowserId from '../../utils/getBrowserId'
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

const Heading = styled.h2`
  font-size: 24px;
  font-weight: 500;
`

const BreakRow = styled.div`
  margin-top: 24px;
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

  const playAsGuest = (name?: string) => {
    if (!name) {
      name = LocalStorageManager.get('guestName') || ''
    }

    play('playAsGuest', `${getBrowserId()}|${name}`, 'NORMAL')
  }

  const playAsUser = (queueType: 'NORMAL' | 'RANKED') => {
    play(
      'playAsUser',
      `${getBrowserId()}|${userId}|${accessToken}|${queueType}`,
      queueType
    )
  }

  const play = (
    message: 'playAsGuest' | 'playAsUser',
    data: string,
    queueType: 'NORMAL' | 'RANKED'
  ) => {
    const tutorialFinished =
      LocalStorageManager.get('tutorialFinished') === 'true' ||
      !LocalStorageManager.supported
    if (!tutorialFinished) {
      let guestName = LocalStorageManager.get('guestName')
      if (!guestName) {
        guestName = `Guest ${Math.floor(Math.random() * 10)}`
      }

      Socket.send(
        'playTutorial',
        `${getBrowserId()}|${store.user ? store.user.name : guestName}`
      )
      return
    }

    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
    Socket.send(message, data)
    store.queue = {
      type: queueType,
      currentTime: 0,
      averageTime: 0,
      playerCount: 0,
    }
  }

  if (loggedIn === null) return <Container />

  return (
    <Container>
      <Heading>Play</Heading>

      {store.queue ? (
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
