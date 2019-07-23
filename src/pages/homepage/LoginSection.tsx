import styled from 'styled-components'
import { useState, useEffect, ChangeEvent } from 'react'
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'
import {
  ReactFacebookLoginInfo,
  ReactFacebookFailureResponse,
} from 'react-facebook-login'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import PlayButton from './PlayButton'
import NameInput from './NameInput'
import React from 'react'
import {
  PRIMARY,
  BOX_SHADOW,
  GOOGLE_CLIENT_ID,
  COLOR,
} from '../../constants/react'
import { useAuth } from '../../auth'
import Heading from './Heading'
import Spinner from '../../components/Spinner'
import authHeader from '../../utils/authHeader'
import shadeColor from '../../utils/shade'
import Api from '../../Api'
import store from '../../store'
import { observer } from 'mobx-react-lite'

const Container = styled.div``

const Placeholder = styled.div`
  width: 250px;
  height: 85px;
`

const ChooseNameSection = styled.div`
  display: flex;
  margin-top: 4px;
`

const LoginButton = styled.div<{ color: string }>`
  width: 280px;
  background: ${props => props.color};
  height: 45px;
  margin-top: 16px;
  padding-left: 12px;
  display: flex;
  align-items: center;
  font-weight: 500;
  border-radius: 4px;
  font-size: 18px;
  color: #fff;
  transition: 200ms;
  border: 2px solid ${props => shadeColor(props.color, -20)};

  :hover {
    transform: scale(1.05);
  }
`

const GoogleIcon = styled.img`
  height: 24px;
  margin-right: 8px;
`

const PlayButtonWrapper = styled.div`
  margin-top: 24px;
`

const SaveButton = styled.a<{ disabled: boolean }>`
  display: block;
  background: ${props => (props.disabled ? '#888' : PRIMARY)};
  color: #fff;
  padding: 8px 0;
  font-weight: 500;
  font-size: 24px;
  box-shadow: ${BOX_SHADOW};
  border-radius: 4px;
  transition: 200ms;
  width: 160px;
  text-align: center;

  :hover {
    transform: ${props => !props.disabled && 'scale(1.05)'};
  }
`

const NameTaken = styled.p<{ visible: boolean }>`
  opacity: ${props => (props.visible ? 1 : 0)};
  color: ${PRIMARY};
  font-weight: 500;
`

const SpinnerContainer = styled.div`
  margin-top: 6px;
  margin-left: 8px;
`

let nameValidationTimeout: NodeJS.Timeout | null = null

interface Props {
  play: () => void
}
const LoginSection: React.FC<Props> = ({ play }) => {
  const [name, setName] = useState('')
  const [nameValid, setNameValid] = useState<boolean | null>(false)
  const { userId, accessToken, login, logout, loggedIn, fetchUser } = useAuth()

  // Validate name
  useEffect(() => {
    if (nameValidationTimeout) {
      clearTimeout(nameValidationTimeout)
      nameValidationTimeout = null
    }

    if (!name) {
      setNameValid(false)
      return
    }

    setNameValid(null)

    nameValidationTimeout = setTimeout(() => {
      validateName(name)
    }, 1000)
  }, [name])

  const validateName = (name: string) => {
    Api.ws.get(`/users/validate-name/${name.toLowerCase()}`).then(response => {
      setNameValid(response.data)
    })
  }

  const handleGoogleAuthSuccess = (
    loginResponse: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if (!('getAuthResponse' in loginResponse)) return

    try {
      Api.ws
        .get(`/auth/google`, {
          params: {
            idToken: loginResponse.getAuthResponse().id_token,
          },
        })
        .then(response => {
          const { userId, accessToken, accessTokenExp } = response.data
          login(userId, accessToken, accessTokenExp)
        })
    } catch {
      logout()
      throw new Error('Google authentication failed.')
    }
  }

  const handleGoogleAuthFailure = (arg: any) => {
    console.error('Google authentication failed.')
    console.log(arg)
    logout()
  }

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value)
  }

  const handleNameSave = async () => {
    if (!nameValid || !accessToken) return

    const guestId = localStorage.getItem('browserId')

    await Api.ws.patch(
      `/users/${userId}`,
      { name, guestId },
      authHeader(accessToken)
    )

    await fetchUser()
  }

  const handleFacebookAuthResponse = (
    response: ReactFacebookLoginInfo | ReactFacebookFailureResponse
  ) => {
    if (!('accessToken' in response)) return

    try {
      Api.ws
        .get(`/auth/facebook`, {
          params: {
            accessToken: response.accessToken,
          },
        })
        .then(response => {
          const { userId, accessToken, accessTokenExp } = response.data
          login(userId, accessToken, accessTokenExp)
        })
    } catch {
      logout()
      throw new Error('Facebook authentication failed.')
    }
  }

  if (loggedIn === null || (loggedIn && !store.user)) return <Placeholder />

  if (loggedIn && store.user) {
    if (store.user.name) {
      return (
        <Container>
          <Heading>Logged in as {store.user.name}</Heading>
          <PlayButtonWrapper>
            <PlayButton onClick={play}>Play</PlayButton>
          </PlayButtonWrapper>
        </Container>
      )
    } else {
      return (
        <Container>
          <Heading>Choose your nickname</Heading>

          <NameTaken visible={nameValid === false && !!name}>
            Nickname already exists
          </NameTaken>

          <ChooseNameSection>
            <NameInput
              placeholder="nickname"
              value={name}
              onChange={handleNameChange}
            />
            {nameValid === null ? (
              <SpinnerContainer>
                <Spinner size="32px" thickness="4px" color="#fff" />
              </SpinnerContainer>
            ) : (
              <SaveButton disabled={!nameValid} onClick={handleNameSave}>
                Save
              </SaveButton>
            )}
          </ChooseNameSection>
        </Container>
      )
    }
  } else {
    return (
      <Container>
        <Heading>Sign In</Heading>
        <GoogleLogin
          clientId={GOOGLE_CLIENT_ID}
          render={(props: any) => (
            <LoginButton color={PRIMARY} onClick={props.onClick}>
              <GoogleIcon src="/static/icons/google.svg" />
              Sign in with Google
            </LoginButton>
          )}
          onSuccess={handleGoogleAuthSuccess}
          onFailure={handleGoogleAuthFailure}
        />
        <FacebookLogin
          appId="2146819318950261"
          autoLoad={true}
          callback={handleFacebookAuthResponse}
          render={(props: any) => (
            <LoginButton color={COLOR.FACEBOOK} onClick={props.onClick}>
              <GoogleIcon src="/static/icons/facebook.svg" />
              Sign in with Facebook
            </LoginButton>
          )}
        />
      </Container>
    )
  }
}

export default observer(LoginSection)
