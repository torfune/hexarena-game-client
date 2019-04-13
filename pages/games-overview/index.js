import React, { useState, useEffect } from 'react'
import axios from 'axios'
import GamesList from './GamesList'

const GAMESERVER_HOST = process.env.REACT_APP_GAMESERVER_HOST

const GamesOverview = () => {
  const [games, setGames] = useState(null)

  const fetchGames = async () => {
    const response = await axios.get(`http://${GAMESERVER_HOST}/games`)

    setGames(response.data)

    setTimeout(fetchGames, 4 * 1000)
  }

  useEffect(() => {
    fetchGames()
  }, [])

  if (!games) return null

  return <GamesList games={games} />
}

export default GamesOverview
