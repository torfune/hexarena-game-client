import axios from 'axios'
import { useState, useEffect, ChangeEvent } from 'react'
import styled from 'styled-components'
import Router from 'next/router'
import Heading from '../Heading'
import { FadeUp } from '../../../components/Animations'
import PlayButton from './PlayButton'
import NameInput from './NameInput'
import getServerHost from '../../../utils/getServerHost'
import { PRIMARY } from '../../../constants/react'

const Container = styled.div``

const Row = styled.div`
  display: flex;
  margin-top: 32px;
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
    const savedName = localStorage.getItem('name')
    if (savedName) {
      setName(savedName)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    setInvalidName(false)
    localStorage.setItem('name', event.target.value)
  }

  const handleKeyDown = ({ key }: KeyboardEvent) => {
    if (key === 'Enter') {
      play()
    }
  }

  const play = async () => {
    const { WS_HOST } = getServerHost(window.location.hostname)

    console.log(`name: ${name}`)

    if (!name) {
      Router.push('/game')
      return
    }

    axios
      .get(`http://${WS_HOST}/users/validate-name/${name}`)
      .then(response => {
        if (response.data) {
          Router.push('/game')
        } else {
          setInvalidName(true)
          setName('')
        }
      })
  }

  return (
    <FadeUp>
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
    </FadeUp>
  )
}

export default GuestSection
