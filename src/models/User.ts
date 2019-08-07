interface User {
  _id: string
  name: string | null
  elo: number
  diamonds: number
  neverPlayed: boolean
  muted: boolean
  auth: {
    type: 'google' | 'facebook'
    id: string
  }
  createdAt: number
}

export default User
