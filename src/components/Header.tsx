import styled from 'styled-components'
import React from 'react'
import { version } from '../../package.json'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import store from '../store'
import formatTime from '../utils/formatTime'
import Socket from '../websockets/Socket'
import { BREAKPOINT, Z_INDEX } from '../constants/react'

const Container = styled.div`
  width: 100vw;
  z-index: ${Z_INDEX.HEADER};
  position: fixed;
  top: 0;
  display: flex;
  background: #111111f8;
  padding: 0 48px;
  height: 60px;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid #000;
  color: #fff;
`

const Logo = styled.h1`
  font-size: 32px;
  color: #fff;
  display: flex;
  align-items: center;

  > a {
    color: #fff;
  }

  > img {
    height: 22px;
    margin-right: 12px;
    filter: invert(1);
  }

  @media (max-width: ${BREAKPOINT.FINAL}) {
    font-size: 32px;
    justify-content: center;

    > img {
      height: 23px;
      margin-right: 8px;
    }
  }
`

const Version = styled.p`
  font-size: 16px;
  font-weight: 200;

  @media (max-width: 1100px) {
    display: none;
  }
`

const LeftSection = styled.div`
  margin-right: auto;
  display: flex;
  align-items: center;

  @media (max-width: ${BREAKPOINT.FINAL}) {
    margin-right: 0;
    width: 100%;
    justify-content: center;
  }
`

const Button = styled.div`
  background: #fff;
  border-radius: 50%;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  width: 24px;
  margin-left: 12px;
  transition: 100ms;

  > img {
    height: 10px;
  }

  :hover {
    background: #aaa;
  }
`

const SpectateSection = styled.div`
  margin-left: 24px;
  border-left: 2px solid #fff;
  display: flex;
  padding: 4px 24px;
  align-items: center;

  > img {
    height: 32px;
    filter: invert(1);
  }

  p {
    font-size: 24px;
    margin-left: 16px;
  }
`

const QueueSection = styled.div`
  display: flex;
  align-items: center;
  margin-right: 32px;
`

const Time = styled.p`
  color: #fff;
  font-weight: 300;
  font-size: 24px;
`

const Header = () => {
  const { spectating, queue } = store

  const cancelQueue = () => {
    Socket.send('cancelQueue')
    store.queue = null
  }

  const getNextGameId = () => {
    if (!store.game) return

    const gameId = store.game.id

    if (store.runningGames.length === 0) return null

    if (store.game.status === 'finished') {
      return store.runningGames[0].id
    }

    if (store.runningGames.length === 1) return null

    const index = store.runningGames.findIndex(game => {
      return game.id === gameId
    })

    if (index === -1) return null

    if (index === store.runningGames.length - 1) {
      return store.runningGames[0].id
    }

    for (let i = index; i < store.runningGames.length; i++) {
      const id = store.runningGames[i].id
      if (id !== gameId) {
        return id
      }
    }

    return null
  }

  const nextGameId = getNextGameId()
  const gameIndex = store.runningGames.findIndex(game => {
    if (store.game && game.id === store.game.id) {
      return true
    }
    return false
  })

  const handleNextGameClick = () => {
    if (nextGameId) {
      Socket.send('spectate', nextGameId)
    }
  }

  return (
    <Container>
      <LeftSection>
        <Logo>
          <img src="/static/images/castle-icon.png" />
          {store.game && !store.spectating ? (
            <a href="/">HexArena.io</a>
          ) : (
            <Link to="/">HexArena.io</Link>
          )}
        </Logo>

        {spectating && store.game && gameIndex !== -1 && (
          <SpectateSection>
            <img src="/static/icons/spectate.svg" />
            <p>Spectating</p>
            <Link to="/">
              <Button>
                <img src="/static/icons/cross.svg" />
              </Button>
            </Link>
            {nextGameId !== null && (
              <Button onClick={handleNextGameClick}>
                <img src="/static/icons/right-arrow.svg" />
              </Button>
            )}
          </SpectateSection>
        )}
      </LeftSection>

      {queue && (
        <QueueSection>
          <Time>{formatTime(queue.currentTime)}</Time>
          <Button onClick={cancelQueue}>
            <img src="/static/icons/cross.svg" />
          </Button>
        </QueueSection>
      )}

      <Version>{version}</Version>
    </Container>
  )
}

export default observer(Header)
