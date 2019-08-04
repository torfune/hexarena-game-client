interface User {
  _id: string
  name: string | null
  elo: number
  diamonds: number
  neverPlayed: boolean
  auth: {
    type: 'google' | 'facebook'
    id: string
  }
  createdAt: number
}

export default User
