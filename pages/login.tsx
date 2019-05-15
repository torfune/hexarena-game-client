import styled from 'styled-components'
import { useState, useEffect } from 'react'
import {
  GoogleLogin,
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'
import axios from 'axios'
import { WS_URL, GOOGLE_CLIENT_ID } from '../constants/react'
import authHeader from '../utils/authHeader'
import { useAuth } from '../auth'
import User from '../models/User'

const Container = styled.div`
  color: #111;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 64px;
  align-items: center;
  margin: 0 auto;
  width: 600px;
  margin-top: 64px;
  border-radius: 4px;
`

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 500;
`

const LoginButton = styled(GoogleLogin)`
  margin-top: 64px;
  width: 200px;
`

const LogoutButton = styled.div`
  margin-top: 64px;
  background: #eee;
  text-align: center;
  padding: 16px 64px;
  font-weight: 500;
  border-radius: 2px;

  :hover {
    background: #ddd;
  }
`

const Login = () => {
  const [user, setUser] = useState<User | null>(null)
  const { userId, accessToken, login, logout, loggedIn } = useAuth()

  useEffect(() => {
    if (userId && accessToken) {
      fetchUser(accessToken)
    }
  }, [userId, accessToken])

  const handleGoogleAuthSuccess = (
    loginResponse: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if (!('getAuthResponse' in loginResponse)) return

    try {
      axios
        .get(`${WS_URL}/auth/google`, {
          params: {
            idToken: loginResponse.getAuthResponse().id_token,
          },
        })
        .then(response => {
          const { userId, accessToken, accessTokenExp } = response.data
          login(userId, accessToken, accessTokenExp)
        })
    } catch {
      console.error('Authentication failed')
    }
  }

  const handleGoogleAuthFailure = () => {
    console.error('Authentication failed')
  }

  const fetchUser = async (accessToken: string) => {
    const response = await axios.get(
      `${WS_URL}/users/${userId}`,
      authHeader(accessToken)
    )

    if (!response.data) {
      logout()
    } else {
      setUser(response.data)
    }
  }

  if (loggedIn === null || (loggedIn && !user)) return null

  return (
    <Container>
      {loggedIn && user ? (
        <>
          <Heading>{user.name}</Heading>
          <LogoutButton onClick={logout}>Logout</LogoutButton>
        </>
      ) : (
        <>
          <Heading>Login</Heading>
          <LoginButton
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Sign in"
            onSuccess={handleGoogleAuthSuccess}
            onFailure={handleGoogleAuthFailure}
          />
        </>
      )}
    </Container>
  )
}

export default Login
