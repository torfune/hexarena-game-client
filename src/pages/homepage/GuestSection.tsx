import Axios from 'axios'
import { useState, useEffect, ChangeEvent } from 'react'
import styled from 'styled-components'
import Heading from './Heading'
import { FadeUp } from '../../components/Animations'
import PlayButton from './PlayButton'
import NameInput from './NameInput'
import getServerHost from '../../utils/getServerHost'
import { PRIMARY, HOMEPAGE_BREAKPOINT } from '../../constants/react'
import React from 'react'
import getBrowserId from '../../utils/getBrowserId'
import Socket from '../../websockets/Socket'
import store from '../../store'

const Container = styled.div`
  margin-left: 48px;

  @media (max-width: ${HOMEPAGE_BREAKPOINT}) {
    margin-left: 0;
    margin-top: 48px;
  }
`

const Row = styled.div`
  display: flex;
  margin-top: 16px;
`

const NameTaken = styled.p<{ visible: boolean }>`
  opacity: ${props => (props.visible ? 1 : 0)};
  color: ${PRIMARY};
  font-weight: 500;
  margin-top: 8px;
`

const GuestSection = () => {
  const [name, setName] = useState('')
  const [invalidName, setInvalidName] = useState(false)

  useEffect(() => {
    const guestName = localStorage.getItem('guestName')
    if (guestName) {
      setName(guestName)
    }
  }, [])

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    setInvalidName(false)
    localStorage.setItem('guestName', event.target.value)
  }

  const play = async () => {
    if (!name) {
      Socket.send('playAsGuest', `${getBrowserId()}|${name}`)
      store.waitingTime = {
        current: 0,
        average: 0,
        players: 0,
      }
      return
    }

    const { WS_HOST } = getServerHost(window.location.hostname)
    const { data: valid } = await Axios.get(
      `http://${WS_HOST}/users/validate-name/${name.toLowerCase()}`
    )

    if (valid) {
      Socket.send('playAsGuest', `${getBrowserId()}|${name}`)
      store.waitingTime = {
        current: 0,
        average: 0,
        players: 0,
      }
    } else {
      setInvalidName(true)
      setName('')
    }
  }

  return (
    <Container>
      <Heading>Play as guest</Heading>

      <Row>
        <div>
          <NameInput
            placeholder="Guest 42"
            value={name}
            onChange={handleNameChange}
          />
          <NameTaken visible={invalidName}>This name is taken</NameTaken>
        </div>

        <PlayButton onClick={play}>Play</PlayButton>
      </Row>
    </Container>
  )
}

export default GuestSection
