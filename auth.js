import React, { useState, useEffect } from 'react'
import axios from 'axios'
import authHeader from './utils/authHeader'
import { WS_URL } from './constants/react'

const AuthContext = React.createContext({})

const AuthProvider = ({ children }) => {
  const [loaded, setLoaded] = useState(false)
  const [loggedIn, setLoggedIn] = useState(null)
  const [credentials, setCredentials] = useState({
    userId: null,
    accessToken: null,
    accessTokenExp: null,
  })

  useEffect(() => {
    const userId = localStorage.getItem('userId')
    const accessToken = localStorage.getItem('accessToken')
    const accessTokenExp = localStorage.getItem('accessTokenExp')

    if (accessTokenExp) {
      const expiresIn = Number(accessTokenExp) - Math.floor(Date.now() / 1000)

      if (expiresIn > 0) {
        const expiresInDays = Math.floor(expiresIn / 60 / 60 / 24)
        console.log(`Token expires in ${expiresInDays} days`)

        if (expiresInDays < 4) {
          try {
            axios
              .get(`${WS_URL}/auth/extend`, authHeader(accessToken))
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
    } else {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    if (loaded) {
      const loggedIn =
        !!credentials.userId &&
        !!credentials.accessToken &&
        !!credentials.accessTokenExp

      setLoggedIn(loggedIn)
    }
  }, [credentials, loaded])

  const login = (userId, accessToken, accessTokenExp) => {
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
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthProvider }
