import styled from 'styled-components'
import { History } from 'history'
import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import Header from '../components/Header'
import Chat from './homepage/Chat'
import store from '../store'
import { CHAT_WIDTH, PRIMARY } from '../constants/react'
import Leaderboard from './game/hud/Leaderboard'
import HoverPreview from './game/hud/HoverPreview'
import EndScreen from './game/screens/EndScreen'
import GameTime from './game/hud/GameTime'
import MatchFound from '../components/MatchFound'
import Economy from './game/hud/Economy'
import Socket from '../websockets/Socket'
import { Link } from 'react-router-dom'
import shadeColor from '../utils/shade'
import Spectators from './game/hud/Spectators'

const Container = styled.div`
  width: calc(100vw - ${CHAT_WIDTH});
  height: 100vh;
  overflow: hidden;
`

const InfoContainer = styled.div`
  margin-top: 160px;
  color: #fff;
  text-align: center;

  h2 {
    font-size: 30px;
    font-weight: 500;
  }

  button {
    display: flex;
    background: ${PRIMARY};
    color: #fff;
    font-weight: 500;
    font-size: 20px;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: 200ms;
    width: 200px;
    height: 45px;
    text-align: center;
    border: 2px solid ${shadeColor(PRIMARY, -20)};
    margin: 64px auto;

    :hover {
      transform: scale(1.05);
    }
  }
`

let timeout: NodeJS.Timeout | null = null

interface Props {
  history: History
}
const Spectate: React.FC<Props> = ({ history }) => {
  const [loading, setLoading] = useState(true)

  store.routerHistory = history

  useEffect(() => {
    if (!store.spectating) {
      const gameId = window.location.href.split('?game=')[1]
      Socket.send('spectate', gameId)
    }

    timeout = setTimeout(() => {
      setLoading(false)
      timeout = null
    }, 500)

    return () => {
      if (timeout) {
        clearTimeout(timeout)
        timeout = null
      }
    }
  }, [])

  useEffect(() => {
    if (store.game) {
      const canvas = document.getElementById('game-canvas')
      if (!canvas) throw Error('Cannot find canvas.')
      store.game.render(canvas)
    }
  }, [store.game])

  return (
    <>
      <Header />
      <Container>
        <div id="game-canvas" />

        {store.spectating && store.game ? (
          <>
            <GameTime />
            <HoverPreview />
            <Spectators />
            <Leaderboard />
            <Economy />
            {store.game.status === 'finished' && <EndScreen />}
          </>
        ) : (
          <InfoContainer>
            {!loading && (
              <>
                <h2>Game not found</h2>
                <Link to="/">
                  <button>Continue</button>
                </Link>
              </>
            )}
          </InfoContainer>
        )}
      </Container>

      <Chat />
      <MatchFound />
    </>
  )
}

export default observer(Spectate)
