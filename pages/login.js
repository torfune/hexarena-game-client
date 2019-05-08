import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { GoogleLogin } from 'react-google-login'
import axios from 'axios'
import useAuth from '../hooks/useAuth'
import { WS_URL, GOOGLE_CLIENT_ID } from '../constants/react'
import authHeader from '../utils/authHeader'

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
  const [user, setUser] = useState(null)
  const { loggedIn, userId, accessToken, login, logout } = useAuth()

  useEffect(() => {
    if (userId && accessToken) {
      fetchUser()
    }
  }, [userId, accessToken])

  const handleGoogleAuthSuccess = async authResult => {
    try {
      const { data } = await axios.get(`${WS_URL}/auth/google`, {
        params: {
          idToken: authResult.tokenId,
        },
      })

      login(data.userId, data.accessToken, data.accessTokenExp)
    } catch {
      console.error('Authentication failed')
    }
  }

  const fetchUser = async () => {
    const response = await axios.get(
      `${WS_URL}/users/${userId}`,
      authHeader(accessToken)
    )

    setUser(response.data)
  }

  if (loggedIn === null || (loggedIn && !user)) {
    return null
  }

  return (
    <Container>
      {loggedIn ? (
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
          />
        </>
      )}
    </Container>
  )
}

export default Login
