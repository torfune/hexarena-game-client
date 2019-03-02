import React, { useState, useEffect } from 'react'
import axios from 'axios'

import GamesList from './components/GamesList'
import { GAMESERVER_URL } from '../../config'

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
