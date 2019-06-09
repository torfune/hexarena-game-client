import React, { useState, useEffect, createContext, useContext } from 'react'
import axios from 'axios'
import authHeader from './utils/authHeader'
import Credentials from './types/Credentials'
import getServerHost from './utils/getServerHost'
import User from './models/User'
import Axios from 'axios'

interface Auth {
  loggedIn: boolean | null
  userId: string | null
  user: User | null
  accessToken: string | null
  accessTokenExp: string | null
  login: (userId: string, accessToken: string, accessTokenExp: string) => void
  logout: () => void
}

export const AuthContext = createContext<Auth>({
  loggedIn: null,
  userId: null,
  user: null,
  accessToken: null,
  accessTokenExp: null,
  login: () => {},
  logout: () => {},
})
export const useAuth = () => useContext(AuthContext)

interface Props {
  children: React.ReactNode
}
export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [loaded, setLoaded] = useState(false)
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [credentials, setCredentials] = useState<Credentials>({
    userId: null,
    accessToken: null,
    accessTokenExp: null,
  })

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    const accessToken = localStorage.getItem('accessToken')
    const accessTokenExp = localStorage.getItem('accessTokenExp')

    if (!accessToken || !accessTokenExp || !userId) {
      setLoaded(true)
      return
    }

    const expiresIn = Number(accessTokenExp) - Math.floor(Date.now() / 1000)
    const { WS_HOST } = getServerHost(window.location.hostname)

    if (expiresIn > 0) {
      const expiresInDays = Math.floor(expiresIn / 60 / 60 / 24)
      console.log(`Token expires in ${expiresInDays} days.`)

      if (expiresInDays < 4) {
        try {
          axios
            .get(`http://${WS_HOST}/auth/extend`, authHeader(accessToken))
            .then(({ data }) => {
              login(userId, data.accessToken, data.accessTokenExp)
              console.log(`Token extended.`)
            })
        } catch (err) {
          logout()
          throw err
        }
      } else {
        setCredentials({ userId, accessToken, accessTokenExp })
        setLoaded(true)
      }
    } else {
      logout()
    }

    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      const { userId, accessToken, accessTokenExp } = credentials

      if (!userId || !accessToken || !accessTokenExp) {
        setLoggedIn(false)
        return
      }

      fetchUser(userId, accessToken)
      setLoggedIn(true)
    }
  }, [credentials, loaded])

  const fetchUser = async (userId: string, accessToken: string) => {
    const { WS_HOST } = getServerHost(window.location.hostname)
    const response = await Axios.get(
      `http://${WS_HOST}/users/${userId}`,
      authHeader(accessToken)
    )

    if (!response.data) {
      logout()
    } else {
      setUser(response.data)
    }
  }

  const login = (
    userId: string,
    accessToken: string,
    accessTokenExp: string
  ) => {
    localStorage.setItem('userId', userId)
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('accessTokenExp', accessTokenExp)

    setCredentials({ userId, accessToken, accessTokenExp })
    setLoaded(true)
  }

  const logout = () => {
    localStorage.removeItem('userId')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('accessTokenExp')

    setCredentials({ userId: null, accessToken: null, accessTokenExp: null })
    setUser(null)
    setLoaded(true)
  }

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        userId: credentials.userId,
        accessToken: credentials.accessToken,
        accessTokenExp: credentials.accessTokenExp,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
