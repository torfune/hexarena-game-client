import RunningGame, { RunningGamePlayer } from '../types/RunningGame'
import GameMode from '../types/GameMode'

const parseRunningGames = (payload: string) => {
  const runningGames: RunningGame[] = []

  if (!payload) return []

  const gamesPayload = payload.split('><')
  for (let i = 0; i < gamesPayload.length; i++) {
    const segments = gamesPayload[i].split('|')

    let id: string = ''
    let finishesAt: number = 0
    let mode: GameMode = 'ffa'

    const players: RunningGamePlayer[] = []
    let currentPlayer: {
      name?: string
      pattern?: string
      alive?: boolean
    } = {}

    for (let j = 0; j < segments.length; j++) {
      const segment = segments[j]

      // Game info
      switch (j) {
        case 0:
          id = segment
          continue
        case 1:
          finishesAt = Number(segment)
          continue
        case 2:
          mode = segment as GameMode
          continue
      }

      // Players
      switch (j - players.length * 3) {
        case 3:
          currentPlayer.name = segment
          continue
        case 4:
          currentPlayer.pattern = segment
          continue
        case 5:
          currentPlayer.alive = segment === 'true'
          break
      }

      const { name, pattern, alive } = currentPlayer
      if (name && pattern && alive !== undefined) {
        players.push({ name, pattern, alive })
        currentPlayer = {}
      }
    }

    runningGames.push({
      id,
      finishesAt,
      mode,
      players,
    })
  }

  return runningGames
}

export default parseRunningGames
