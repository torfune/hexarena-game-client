import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Heading from '../Heading'
import { PRIMARY, BOX_SHADOW, SECONDARY, TEXT_SHADOW } from 'constants/react'

const Container = styled.div``

const Row = styled.div`
  display: flex;
  align-items: flex-end;
`

const Label = styled.p`
  font-size: 14px;
  color: #eee;
  font-weight: 300;
  margin-bottom: 4px;
`

const NameInput = styled.input.attrs({
  placeholder: 'Guest 42',
  maxLength: 12,
})`
  padding: 8px 16px;
  border-radius: 2px;
  box-shadow: ${BOX_SHADOW};
  font-size: 16px;
  background: #eee;

  :hover,
  :focus {
    background: #fff;
  }
`

const PlayButton = styled.a`
  display: block;
  background: ${PRIMARY};
  color: #fff;
  padding: 8px 64px;
  font-weight: 500;
  box-shadow: ${BOX_SHADOW};
  margin-left: 16px;
  height: 35px;
  border-radius: 2px;
  transition: 200ms;

  :hover {
    transform: scale(1.1);
  }
`

const PlaySection = () => {
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

  return (
    <Container>
      <Heading>
        <span>Alpha</span> test is running
      </Heading>

      <Row>
        <div>
          <Label>Nickname</Label>
          <NameInput value={name} onChange={handleNameChange} />
        </div>

        <Link href="/game">
          <PlayButton>Play</PlayButton>
        </Link>
      </Row>
    </Container>
  )
}

export default PlaySection
