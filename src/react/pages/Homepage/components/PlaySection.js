import React, { useState } from 'react'
import styled from 'styled-components'

import PlayButton from './PlayButton'
import NameInput from './NameInput'
import Heading from './Heading'
import Countdown from './Countdown'
import PatternSelector from './PatternSelector'

const patterns = [
  '#FF5F39',
  '#2d98da',
  '#fbc531',
  '#05c46b',
  '#D980FA',
  '#ffaf40',
  '#e77f67',
]

const Container = styled.div`
  margin-top: 80px;
  padding: 96px 128px;
  background: #383838;
  box-shadow: 0px 1px 24px 0px rgba(0, 0, 0, 0.05);

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 64px;
`

const InputAndButtonContainer = styled.div`
  display: flex;
`

const PlaySection = ({ disabledUntil, countdownTime }) => {
  const storageName = window.localStorage.getItem('name')
  const storagePattern = window.localStorage.getItem('pattern')

  const randomPattern = patterns[Math.floor(Math.random() * patterns.length)]

  const [name, setName] = useState(storageName || '')
  const [pattern, setPattern] = useState(storagePattern || randomPattern)

  const handleNameChange = event => {
    setName(event.target.value)
    window.localStorage.setItem('name', event.target.value)
  }

  const handlePatternChange = newPattern => {
    setPattern(newPattern)
    window.localStorage.setItem('pattern', newPattern)
  }

  if (disabledUntil === null) return null

  return (
    <Container>
      <div>
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

            <PatternSelector
              patterns={patterns}
              onChange={handlePatternChange}
              selected={pattern}
            />
          </div>
        ) : (
          <Countdown time={countdownTime} />
        )}
      </div>
    </Container>
  )
}

export default PlaySection
