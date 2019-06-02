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
import React from 'react'

const Container = styled.div`
  color: #fff;
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
  box-shadow: ${BOX_SHADOW};
  transition: 200ms;

  :hover {
    transform: scale(1.05);
  }
`

const LoginBar: React.FC = () => {
  const { loggedIn, login } = useAuth()
  const { player } = store

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
    }
  }

  const handleGoogleAuthFailure = () => {
    console.error('Authentication failed')
  }

  if (loggedIn && player) {
    return (
      <Container>
        <Name>{player.name}</Name>
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
      </Container>
    )
  }
}

export default observer(LoginBar)
