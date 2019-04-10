import React, { useState } from 'react'
import styled from 'styled-components'

import PlayButton from './PlayButton'
import NameInput from './NameInput'
import Heading from './Heading'
import Countdown from './Countdown'

const Container = styled.div`
  margin-top: 80px;
  padding: 96px 128px;
  background: #383838;
  box-shadow: 0px 1px 24px 0px rgba(0, 0, 0, 0.05);
`

const InputAndButtonContainer = styled.div`
  display: flex;
`

const PlaySection = ({ disabledUntil, countdownTime, alreadyPlaying }) => {
  const storageName = window.localStorage.getItem('name')

  const [name, setName] = useState(storageName || '')

  const handleNameChange = event => {
    setName(event.target.value)
    window.localStorage.setItem('name', event.target.value)
  }

  if (disabledUntil === null) return null

  return (
    <Container>
      <Heading>
        {disabledUntil === false ? (
          'Quick play'
        ) : (
          <p>
            Next <span>Alpha</span> test starts in:
          </p>
        )}
      </Heading>

      {disabledUntil === false ? (
        <div>
          <InputAndButtonContainer>
            <NameInput value={name} onChange={handleNameChange} />
            <PlayButton />
          </InputAndButtonContainer>
        </div>
      ) : (
        <Countdown time={countdownTime} />
      )}
    </Container>
  )
}

export default PlaySection
