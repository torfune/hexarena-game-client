export interface Player {
  name: string
  userId: string | null
  pattern: string
  eloChange: number | null
  alive: boolean
}
interface FinishedGame {
  _id: string
  ranked: boolean
  mode: '1v1' | '2v2' | 'FFA'
  winners: Player[]
  losers: Player[]
  startedAt: number
  finishedAt: number
}

export default FinishedGame
