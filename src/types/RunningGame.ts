import GameMode from './GameMode'

interface RunningGamePlayer {
  name: string
  pattern: string
  alive: boolean
}

interface RunningGame {
  id: string
  finishesAt: number
  mode: GameMode
  players: RunningGamePlayer[]
}

export { RunningGamePlayer }
export default RunningGame
