import styled from 'styled-components'
import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import store from '../store'
import parseQuery from '../utils/parseQuery'
import Socket from '../websockets/Socket'
import EndScreen from '../screens/EndScreen'
import Economy from '../hud/Economy'
import Leaderboard from '../hud/Leaderboard'
import GameTime from '../hud/GameTime'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`

const Spectate = observer(() => {
  const [_, refresh] = useState(Date.now())

  useEffect(() => {
    const query = parseQuery()
    if (!query.gameId) throw Error('Missing game id.')

    Socket.send('spectate', `${query.gameId}`)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleResize = () => {
    refresh(Date.now())
  }

  return (
    <Container>
      <div id="game-canvas" />
      {store.game && (
        <>
          <GameTime />
          {store.game.status === 'FINISHED' && <EndScreen />}
        </>
      )}
    </Container>
  )
})

export default Spectate
