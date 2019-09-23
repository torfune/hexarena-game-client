interface Auth {
  type: 'google' | 'facebook'
  id: string
}

interface User {
  _id: string
  name: string | null
  elo: number
  diamonds: number
  neverPlayed: boolean
  moderator: boolean
  mute: {
    mutedAt: number
    mutedBy: string
    messages: string[]
  } | null
  auth: Auth
  createdAt: number
}

export default User
