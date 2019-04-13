import Countdown from './Countdown'
import Heading from './Heading'
import NameInput from './NameInput'
import PlayButton from './PlayButton'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  margin-top: 80px;
  padding: 96px 128px;
  background: #383838;
  box-shadow: 0px 1px 24px 0px rgba(0, 0, 0, 0.05);
`

const InputAndButtonContainer = styled.div`
  display: flex;
`

const PlaySection = ({ disabledUntil, countdownTime }) => {
  const [name, setName] = useState('')

  useEffect(() => {
    const savedName = localStorage.getItem('name')
    if (savedName) {
      setName(savedName)
    }
  }, [])

  const handleNameChange = event => {
    setName(event.target.value)
    localStorage.setItem('name', event.target.value)
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
