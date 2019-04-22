import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { PRIMARY, TEXT_SHADOW } from '../../../constants/react'
import getGameserverHost from 'utils/getGameserverHost'
import axios from 'axios'
import store from 'store'
import { observer } from 'mobx-react-lite'

const Container = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
`

const Column = styled.div`
  text-align: center;
  color: #fff;
  padding-right: 24px;
  padding-left: 24px;
  border-left: 2px solid #333;

  :first-child {
    padding-left: 0;
    border-left: 0;
  }
  :last-child {
    padding-right: 0;
  }
`

const Label = styled.p``

const Number = styled.p`
  margin-top: 8px;
  font-size: 50px;
  color: ${PRIMARY};
  font-weight: 300;
  text-shadow: ${TEXT_SHADOW};
`

let interval = null

const Stats = () => {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    fetchData()
    interval = setInterval(fetchData, 2000)

    return () => {
      clearInterval(interval)
      interval = null
    }
  }, [])

  const fetchData = async () => {
    const GAMESERVER_HOST = getGameserverHost(window.location.hostname)
    const { data: games } = await axios.get(`http://${GAMESERVER_HOST}/games`)

    let ingamePlayers = 0
    let waitingPlayers = 0
    let runningGames = 0

    for (const game of games) {
      if (game.status === 'running') {
        runningGames++
        ingamePlayers += game.players.length
      } else if (game.status === 'pending' || game.status === 'starting') {
        waitingPlayers += game.players.length
      }
    }

    setStats({
      ingamePlayers,
      waitingPlayers,
      runningGames,
    })
  }

  if (!stats) return null

  return (
    <Container>
      <Column>
        <Label>
          In game
          <br />
          players
        </Label>
        <Number>{stats.ingamePlayers}</Number>
      </Column>

      <Column>
        <Label>
          Running
          <br />
          games
        </Label>
        <Number>{stats.runningGames}</Number>
      </Column>

      <Column>
        <Label>
          Finished
          <br />
          games
        </Label>
        <Number>{store.winners.length}</Number>
      </Column>

      <Column>
        <Label>
          Waiting
          <br />
          players
        </Label>
        <Number>{stats.waitingPlayers}</Number>
      </Column>
    </Container>
  )
}

export default observer(Stats)
