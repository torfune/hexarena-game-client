import styled from 'styled-components'
import React from 'react'
import { version } from '../../package.json'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import store from '../store'
import formatTime from '../utils/formatTime'
import Socket from '../websockets/Socket'

const Container = styled.div`
  width: 100vw;
  z-index: 100;
  position: fixed;
  top: 0;
  display: flex;
  background: #111111f8;
  padding: 0 48px;
  height: 80px;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid #000;
  color: #fff;
`

const Logo = styled.h1`
  font-size: 42px;
  color: #fff;

  > a {
    color: #fff;
  }

  > img {
    height: 30px;
    margin-right: 12px;
    filter: invert(1);
  }
`

const Version = styled.p`
  font-size: 28px;
  margin-left: 32px;
  padding-left: 32px;
  border-left: 1px solid #fff;
  font-weight: 200;

  @media (max-width: 1100px) {
    display: none;
  }
`

const Description = styled.p`
  font-size: 28px;
  font-weight: 200;

  @media (max-width: 900px) {
    display: none;
  }
`

const LeftSection = styled.div`
  margin-right: auto;
  display: flex;
  align-items: center;
`

const Button = styled.div`
  background: #fff;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  width: 34px;
  margin-left: 16px;
  transition: 100ms;

  > img {
    height: 14px;
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
    height: 48px;
    filter: invert(1);
  }

  p {
    font-size: 26px;
    margin-left: 16px;
  }
`

const QueueSection = styled.div`
  display: flex;
  align-items: center;
`

const TimesWrapper = styled.div`
  width: 140px;
  display: flex;
  justify-content: space-between;
  margin-right: 16px;
`

const Time = styled.p`
  text-align: right;
  color: #fff;
  font-weight: 300;
  font-size: 14px;
`

const Label = styled.p`
  text-align: right;
  font-weight: 500;
  font-size: 14px;
`

const Header = () => {
  const { spectating, waitingTime } = store

  const cancelQueue = () => {
    Socket.send('cancelQueue')
    store.waitingTime = null
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

      {waitingTime ? (
        <QueueSection>
          <TimesWrapper>
            <div>
              <Label>Current:</Label>
              <Label>Estimated:</Label>
              <Label>Players:</Label>
            </div>
            <div>
              <Time>{formatTime(waitingTime.current)}</Time>
              <Time>
                {waitingTime.average ? formatTime(waitingTime.average) : '-'}
              </Time>
              <Time>{waitingTime.players || '-'}</Time>
            </div>
          </TimesWrapper>

          <Button onClick={cancelQueue}>
            <img src="/static/icons/cross.svg" />
          </Button>
        </QueueSection>
      ) : (
        <Description>Competitive strategy game</Description>
      )}

      <Version>Alpha {version.slice(0, 4)}</Version>
    </Container>
  )
}

export default observer(Header)
