import Axios from 'axios'
import { useState, useEffect, ChangeEvent } from 'react'
import styled from 'styled-components'
import Heading from './Heading'
import PlayButton from './PlayButton'
import NameInput from './NameInput'
import getServerHost from '../../utils/getServerHost'
import { PRIMARY, HOMEPAGE_BREAKPOINT } from '../../constants/react'
import React from 'react'

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

interface Props {
  play: (name?: string) => void
}
const GuestSection: React.FC<Props> = ({ play }) => {
  const [name, setName] = useState('')
  const [invalidName, setInvalidName] = useState(false)

  useEffect(() => {
    let guestName = localStorage.getItem('guestName')
    if (!guestName) {
      guestName = `Guest ${Math.floor(Math.random() * 10000)}`
      localStorage.setItem('guestName', guestName)
    }
    setName(guestName)
  }, [])

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    setInvalidName(false)
    localStorage.setItem('guestName', event.target.value)
  }

  const handlePlayClick = async () => {
    if (!name) {
      play()
      return
    }

    const { WS_HOST } = getServerHost(window.location.hostname)
    const { data: valid } = await Axios.get(
      `http://${WS_HOST}/users/validate-name/${name.toLowerCase()}`
    )

    if (valid) {
      play(name)
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
            placeholder="Nickname"
            value={name}
            onChange={handleNameChange}
          />
          <NameTaken visible={invalidName}>This name is taken</NameTaken>
        </div>

        <PlayButton onClick={handlePlayClick}>Play</PlayButton>
      </Row>
    </Container>
  )
}

export default GuestSection
