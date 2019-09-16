import styled from 'styled-components'
import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import store from '../store'
import { PRIMARY } from '../constants/react'
import Socket from '../websockets/Socket'
import Spinner from './Spinner'

const Container = styled.div`
  position: fixed;
  top: 128px;
  background: #fff;
  padding: 64px;
  width: 500px;
  left: 50vw;
  border-radius: 8px;
  transform: translateX(-50%);
  z-index: 101;
  height: 330px;
`

const DarkOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background: #000;
  width: 100vw;
  height: 100vh;
  opacity: 0.5;
  z-index: 100;
`

const Heading = styled.p`
  color: #111;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  text-transform: uppercase;
`

const AcceptButton = styled.div`
  background: ${PRIMARY};
  padding: 16px 32px;
  color: #fff;
  text-align: center;
  margin-top: 48px;
  font-weight: 600;
  text-transform: uppercase;
  border-radius: 4px;
  font-size: 20px;
  transition: 100ms;

  :hover {
    transform: scale(1.05);
  }
`

const DeclineButton = styled.div`
  border: 1px solid #bbb;
  background: #fff;
  padding: 8px;
  text-transform: uppercase;
  width: 200px;
  margin: 32px auto 0 auto;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  border-radius: 2px;
  transition: 100ms;

  :hover {
    transform: scale(1.05);
  }
`

const StyledSpinner = styled(Spinner)`
  margin: 48px auto 0 auto;
`

const InfoMessage = styled.p`
  text-align: center;
  margin-top: 48px;
`

const MatchFound = () => {
  const [accepted, setAccepted] = useState(false)
  const { matchFound } = store

  const handleAcceptClick = () => {
    Socket.send('acceptMatch')
    setAccepted(true)
    if (store.notification) {
      store.notification.close()
    }
  }

  const handleDeclineClick = () => {
    Socket.send('declineMatch')
    if (store.notification) {
      store.notification.close()
    }
  }

  useEffect(() => {
    if (!store.matchFound) {
      setAccepted(false)
    } else if (store.matchFound && Notification.permission === 'granted') {
      store.notification = new Notification('Match Found', {
        body: 'Click to go to the HexArena tab to accept the match.',
        icon: '/static/images/castle.png',
      })

      store.notification.onclick = event => {
        event.preventDefault()
        window.focus()
        if (store.notification) {
          store.notification.close()
        }
      }
    }
  }, [store.matchFound])

  if (!matchFound) return null

  return (
    <>
      <Container>
        <Heading>Match found</Heading>
        {accepted ? (
          <>
            <StyledSpinner size="64px" thickness="4px" color="#222" />
            <InfoMessage>Waiting for other players</InfoMessage>
          </>
        ) : (
          <>
            <AcceptButton onClick={handleAcceptClick}>Accept!</AcceptButton>
            <DeclineButton onClick={handleDeclineClick}>Decline</DeclineButton>
          </>
        )}
      </Container>
      <DarkOverlay />
    </>
  )
}

export default observer(MatchFound)
