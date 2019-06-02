interface User {
  id: string
  name: string | null
  elo: number
  auth: {
    type: 'google' | 'facebook'
    id: string
  }
}

export default User
