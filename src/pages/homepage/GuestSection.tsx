import { useState, useEffect, ChangeEvent } from 'react'
import styled from 'styled-components'
import Heading from './Heading'
import PlayButton from './PlayButton'
import NameInput from './NameInput'
import { BREAKPOINT } from '../../constants/react'
import React from 'react'
import Api from '../../Api'

const Container = styled.div`
  width: 240px;

  @media (max-width: ${BREAKPOINT.MAIN_1}) {
    margin-top: 48px;
  }

  @media (max-width: ${BREAKPOINT.MAIN_2}) {
    margin-top: 0;
  }

  @media (max-width: ${BREAKPOINT.MAIN_3}) {
    margin-top: 48px;
  }

  @media (max-width: ${BREAKPOINT.MAIN_4}) {
    margin-top: 0;
  }

  @media (max-width: ${BREAKPOINT.MAIN_5}) {
    margin-top: 48px;
  }
`

const InputWrapper = styled.div`
  margin-top: 16px;
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

    const { data: valid } = await Api.ws.get(
      `/users/validate-name/${name.toLowerCase()}`
    )

    if (valid) {
      play(name)
    } else {
      setInvalidName(true)
      setName('')
      localStorage.setItem('guestName', '')
    }
  }

  return (
    <Container>
      {invalidName ? (
        <Heading red>Name is taken or invalid</Heading>
      ) : (
        <Heading>PLAY AS GUEST</Heading>
      )}

      <InputWrapper>
        <NameInput
          placeholder="Nickname"
          value={name}
          onChange={handleNameChange}
        />
      </InputWrapper>

      <PlayButton onClick={handlePlayClick}>Play</PlayButton>
    </Container>
  )
}

export default GuestSection
