interface RunningGamePlayer {
  name: string
  pattern: string
  alive: boolean
}

interface RunningGame {
  id: string
  finishesAt: number
  mode: 'ffa' | 'diplomacy'
  players: RunningGamePlayer[]
}

export { RunningGamePlayer }
export default RunningGame
