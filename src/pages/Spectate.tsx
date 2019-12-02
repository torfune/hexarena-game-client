import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import store from '../store'
import { PRIMARY, BREAKPOINT } from '../constants/react'
import Leaderboard from '../hud/Leaderboard'
import HoverPreview from '../hud/HoverPreview'
import EndScreen from '../screens/EndScreen'
import GameTime from '../hud/GameTime'
import Economy from '../hud/Economy'
import Socket from '../websockets/Socket'
import shadeColor from '../utils/shade'
import Spectators from '../hud/Spectators'

const Container = styled.div`
  width: 100vw;
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

const Spectate = () => {
  const [loading, setLoading] = useState(true)

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
    <Container>
      <div id="game-canvas" />

      {store.spectating && store.game ? (
        <>
          <GameTime />
          <HoverPreview />
          <Spectators />
          <Leaderboard />
          <Economy />
          {store.game.status === 'FINISHED' && <EndScreen />}
        </>
      ) : (
        <InfoContainer>
          {!loading && (
            <>
              <h2>Game not found</h2>
              <a href="http://localhost:3000">
                <button>Continue</button>
              </a>
            </>
          )}
        </InfoContainer>
      )}
    </Container>
  )
}

export default observer(Spectate)
