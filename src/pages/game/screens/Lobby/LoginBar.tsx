import { useAuth } from '../../../../auth'
import { observer } from 'mobx-react-lite'
import store from '../../../../store'
import styled from 'styled-components'
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'
import {
  GOOGLE_CLIENT_ID,
  PRIMARY,
  BOX_SHADOW,
} from '../../../../constants/react'
import getServerHost from '../../../../utils/getServerHost'
import Axios from 'axios'
import React, { useState, useEffect } from 'react'
import authHeader from '../../../../utils/authHeader'
import getBrowserId from '../../../../utils/getBrowserId'

const Container = styled.div`
  color: #fff;
  display: flex;
  align-items: center;
`

const EloSection = styled.div`
  text-align: center;
  margin-left: 32px;
`

const EloLabel = styled.p`
  text-transform: uppercase;
  font-size: 20px;
  color: ${PRIMARY};
  font-weight: 600;
`

const EloValue = styled.p`
  font-size: 20px;
`

const Name = styled.p`
  font-size: 28px;
`

const GoogleIcon = styled.img`
  height: 24px;
  margin-right: 8px;
`

const LoginButton = styled.div`
  width: 250px;
  background: ${PRIMARY};
  height: 45px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  border-radius: 4px;
  font-size: 18px;
  color: #fff;
  transition: 200ms;

  :hover {
    transform: scale(1.05);
  }
`

const LoginBar: React.FC = () => {
  const [elo, setElo] = useState<number | null>(null)
  const { loggedIn, login, userId, accessToken } = useAuth()
  const { player } = store

  useEffect(() => {
    fetchElo()
  }, [])

  const fetchElo = async () => {
    const { WS_HOST } = getServerHost(window.location.hostname)
    let elo = null

    if (loggedIn && userId && accessToken) {
      const { data: user } = await Axios.get(
        `http://${WS_HOST}/users/${userId}`,
        authHeader(accessToken)
      )

      elo = user.elo
    } else {
      const guestId = localStorage.getItem('browserId')
      if (guestId) {
        const { data: guest } = await Axios.get(
          `http://${WS_HOST}/guests/${guestId}`
        )

        if (guest && guest.elo) {
          elo = guest.elo
        }
      }
    }

    setElo(elo)
  }

  const handleGoogleAuthSuccess = async (
    loginResponse: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if (!('getAuthResponse' in loginResponse)) return

    try {
      const { WS_HOST } = getServerHost(window.location.hostname)
      const { data } = await Axios.get(`http://${WS_HOST}/auth/google`, {
        params: {
          idToken: loginResponse.getAuthResponse().id_token,
        },
      })

      const { userId, accessToken, accessTokenExp } = data
      login(userId, accessToken, accessTokenExp)
      window.location.href = '/'
    } catch {
      console.error('Authentication failed')
      window.location.href = '/'
    }
  }

  const handleGoogleAuthFailure = () => {
    console.error('Authentication failed')
    window.location.href = '/'
  }

  if (loggedIn && player) {
    return (
      <Container>
        <Name>{player.name}</Name>
        {elo && elo > 1000 && (
          <EloSection>
            <EloLabel>Elo</EloLabel>
            <EloValue>{elo}</EloValue>
          </EloSection>
        )}
      </Container>
    )
  } else {
    return (
      <Container>
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          render={(props: any) => (
            <LoginButton onClick={props.onClick}>
              <GoogleIcon src="/static/icons/google.svg" />
              Sign in with Google
            </LoginButton>
          )}
          onSuccess={handleGoogleAuthSuccess}
          onFailure={handleGoogleAuthFailure}
        />
        {elo && elo > 1000 && (
          <EloSection>
            <EloLabel>Elo</EloLabel>
            <EloValue>{elo}</EloValue>
          </EloSection>
        )}
      </Container>
    )
  }
}

export default observer(LoginBar)
