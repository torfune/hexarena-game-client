import React, { useState } from 'react'
import styled from 'styled-components'

import PlayButton from './PlayButton'
import NameInput from './NameInput'
import Heading from './Heading'

const Container = styled.div`
  margin-top: 80px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  padding: 96px 128px;
  background: #383838;
  box-shadow: 0px 1px 24px 0px rgba(0, 0, 0, 0.05);
`

const InputAndButtonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;
`

const PlaySection = () => {
  const storageName = window.localStorage.getItem('name')

  const [name, setName] = useState(storageName || '')

  const handleNameChange = event => {
    setName(event.target.value)
    window.localStorage.setItem('name', event.target.value)
  }

  return (
    <Container>
      <div>
        <Heading>Quick play</Heading>
        <InputAndButtonContainer>
          <NameInput value={name} onChange={handleNameChange} />
          <PlayButton />
        </InputAndButtonContainer>
      </div>
    </Container>
  )
}

export default PlaySection
