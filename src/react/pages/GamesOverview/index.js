import React, { useState, useEffect } from 'react'
import axios from 'axios'
import GamesList from './GamesList'

const GAMESERVER_URL = process.env.REACT_APP_GAMESERVER_URL

const GamesOverview = () => {
  const [games, setGames] = useState(null)

  const fetchGames = async () => {
    const response = await axios.get(`${GAMESERVER_URL}/games`)

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
