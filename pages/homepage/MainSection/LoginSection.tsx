import styled from 'styled-components'
import Heading from '../Heading'
import { FadeUp } from '../../../components/Animations'
import { useState, useEffect, ChangeEvent } from 'react'
import User from '../../../models/User'
import { useAuth } from '../../../auth'
import GoogleLogin, {
  GoogleLoginResponse,
  GoogleLoginResponseOffline,
} from 'react-google-login'
import getServerHost from '../../../utils/getServerHost'
import axios from 'axios'
import authHeader from '../../../utils/authHeader'
import Link from 'next/link'
import PlayButton from './PlayButton'
import { GOOGLE_CLIENT_ID, PRIMARY, BOX_SHADOW } from '../../../constants/react'
import NameInput from './NameInput'
import Spinner from '../../../components/Spinner'

const Container = styled.div``

const ChooseNameSection = styled.div`
  display: flex;
  margin-top: 4px;
`

const LoginButton = styled.div`
  width: 250px;
  background: ${PRIMARY};
  height: 45px;
  margin-top: 32px;
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

const LogoutButton = styled.div`
  color: #fff;
  margin-top: 24px;

  :hover {
    text-decoration: underline;
  }
`

const NameTaken = styled.p<{ visible: boolean }>`
  opacity: ${props => (props.visible ? 1 : 0)};
  color: ${PRIMARY};
  font-weight: 500;
`

let nameValidationTimeout: NodeJS.Timeout | null = null

const LoginSection = () => {
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [nameValid, setNameValid] = useState<boolean | null>(false)
  const { userId, accessToken, login, logout, loggedIn } = useAuth()

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

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

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' || !loggedIn) return

    if (user && !user.name) {
      handleNameSave()
    } else {
      window.location.href = '/game'
    }
  }

  const validateName = (name: string) => {
    const { WS_HOST } = getServerHost(window.location.hostname)

    axios
      .get(`http://${WS_HOST}/users/validate-name/${name.toLowerCase()}`)
      .then(response => {
        setNameValid(response.data)
      })
  }

  const handleGoogleAuthSuccess = (
    loginResponse: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if (!('getAuthResponse' in loginResponse)) return

    try {
      const { WS_HOST } = getServerHost(window.location.hostname)
      axios
        .get(`http://${WS_HOST}/auth/google`, {
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

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value)
  }

  const handleNameSave = async () => {
    if (!nameValid || !accessToken) return

    const { WS_HOST } = getServerHost(window.location.hostname)

    await axios.patch(
      `http://${WS_HOST}/users/${userId}`,
      { name },
      authHeader(accessToken)
    )

    await fetchUser(accessToken)
  }

  const fetchUser = async (accessToken: string) => {
    const { WS_HOST } = getServerHost(window.location.hostname)
    const response = await axios.get(
      `http://${WS_HOST}/users/${userId}`,
      authHeader(accessToken)
    )

    if (!response.data) {
      logout()
    } else {
      setUser(response.data)
    }
  }

  if (loggedIn === null || (loggedIn && !user)) return null

  if (loggedIn && user) {
    if (user.name) {
      return (
        <FadeUp>
          <Container>
            <Heading>Logged in as {user.name}</Heading>
            <PlayButtonWrapper>
              <PlayButton href="/game">Play</PlayButton>
            </PlayButtonWrapper>
            <LogoutButton onClick={logout}>Logout</LogoutButton>
          </Container>
        </FadeUp>
      )
    } else {
      return (
        <FadeUp>
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
                <Spinner />
              ) : (
                <SaveButton disabled={!nameValid} onClick={handleNameSave}>
                  Save
                </SaveButton>
              )}
            </ChooseNameSection>

            <LogoutButton onClick={logout}>Logout</LogoutButton>
          </Container>
        </FadeUp>
      )
    }
  } else {
    return (
      <FadeUp>
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
      </FadeUp>
    )
  }
}

export default LoginSection
