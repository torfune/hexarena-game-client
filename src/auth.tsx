import React, { useState, useEffect, createContext, useContext } from 'react'
import authHeader from './utils/authHeader'
import Credentials from './types/Credentials'
import User from './models/User'
import Api from './Api'
import store from './store'

interface Auth {
  loggedIn: boolean | null
  userId: string | null
  accessToken: string | null
  accessTokenExp: string | null
  login: (userId: string, accessToken: string, accessTokenExp: string) => void
  logout: () => void
  fetchUser: () => void
}

export const AuthContext = createContext<Auth>({
  loggedIn: null,
  userId: null,
  accessToken: null,
  accessTokenExp: null,
  login: () => {},
  logout: () => {},
  fetchUser: () => {},
})
export const useAuth = () => useContext(AuthContext)

interface Props {
  children: React.ReactNode
}
export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [loaded, setLoaded] = useState(false)
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
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
    if (expiresIn > 0) {
      const expiresInDays = Math.floor(expiresIn / 60 / 60 / 24)
      if (expiresInDays < 4) {
        try {
          Api.ws
            .get(`/auth/extend`, authHeader(accessToken))
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

      fetchUser()
      setLoggedIn(true)
    }
  }, [credentials, loaded])

  const fetchUser = async () => {
    const { userId, accessToken } = credentials

    if (!userId || !accessToken) {
      console.error(`Can't fetch user.`)
      return
    }

    const response = await Api.ws.get(
      `/users/${userId}`,
      authHeader(accessToken)
    )

    if (!response.data) {
      logout()
    } else {
      store.user = response.data
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
    setLoaded(true)
    store.user = null
  }

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        userId: credentials.userId,
        accessToken: credentials.accessToken,
        accessTokenExp: credentials.accessTokenExp,
        login,
        logout,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
