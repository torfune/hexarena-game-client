interface User {
  _id: string
  name: string | null
  elo: number
  neverPlayed: boolean
  auth: {
    type: 'google' | 'facebook'
    id: string
  }
  createdAt: number
}

export default User
