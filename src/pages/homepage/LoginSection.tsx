import styled from 'styled-components'
import { useState, useEffect, ChangeEvent } from 'react'
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'
import PlayButton from './PlayButton'
import NameInput from './NameInput'
import React from 'react'
import { PRIMARY, BOX_SHADOW, GOOGLE_CLIENT_ID } from '../../constants/react'
import User from '../../models/User'
import { useAuth } from '../../auth'
import Heading from './Heading'
import Spinner from '../../components/Spinner'
import authHeader from '../../utils/authHeader'
import getServerHost from '../../utils/getServerHost'
import Axios from 'axios'
import Socket from '../../websockets/Socket'
import getBrowserId from '../../utils/getBrowserId'
import shadeColor from '../../utils/shade'
import store from '../../store'

const Container = styled.div``

const Placeholder = styled.div`
  width: 250px;
  height: 85px;
`

const ChooseNameSection = styled.div`
  display: flex;
  margin-top: 4px;
`

const LoginButton = styled.div`
  width: 250px;
  background: ${PRIMARY};
  height: 45px;
  margin-top: 16px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 500;
  border-radius: 4px;
  font-size: 18px;
  color: #fff;
  transition: 200ms;
  border: 2px solid ${shadeColor(PRIMARY, -20)};

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
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [nameValid, setNameValid] = useState<boolean | null>(false)
  const { userId, accessToken, login, logout, loggedIn } = useAuth()

  useEffect(() => {
    if (userId && accessToken) {
      fetchUser(accessToken)
    }
  }, [userId, accessToken])

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
    const { WS_HOST } = getServerHost(window.location.hostname)

    Axios.get(
      `http://${WS_HOST}/users/validate-name/${name.toLowerCase()}`
    ).then(response => {
      setNameValid(response.data)
    })
  }

  const handleGoogleAuthSuccess = (
    loginResponse: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if (!('getAuthResponse' in loginResponse)) return

    try {
      const { WS_HOST } = getServerHost(window.location.hostname)
      Axios.get(`http://${WS_HOST}/auth/google`, {
        params: {
          idToken: loginResponse.getAuthResponse().id_token,
        },
      }).then(response => {
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

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value)
  }

  const handleNameSave = async () => {
    if (!nameValid || !accessToken) return

    const { WS_HOST } = getServerHost(window.location.hostname)
    const guestId = localStorage.getItem('browserId')

    await Axios.patch(
      `http://${WS_HOST}/users/${userId}`,
      { name, guestId },
      authHeader(accessToken)
    )

    await fetchUser(accessToken)
  }

  const fetchUser = async (accessToken: string) => {
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

  if (loggedIn === null || (loggedIn && !user)) return <Placeholder />

  if (loggedIn && user) {
    if (user.name) {
      return (
        <Container>
          <Heading>Logged in as {user.name}</Heading>
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

export default LoginSection
