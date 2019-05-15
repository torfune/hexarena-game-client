import Link from 'next/link'
import { useState, useEffect, ChangeEvent } from 'react'
import styled from 'styled-components'
import Router from 'next/router'
import Heading from '../Heading'
import { FadeUp } from '../../../components/Animations'
import { BOX_SHADOW, PRIMARY } from '../../../constants/react'

const Container = styled.div``

const Row = styled.div`
  display: flex;
  align-items: flex-end;
`

const Label = styled.p`
  font-size: 14px;
  color: #eee;
  font-weight: 300;
  margin-bottom: 8px;
`

const NameInput = styled.input.attrs({
  placeholder: 'Guest 42',
  maxLength: 12,
})`
  padding: 8px 16px;
  border-radius: 4px;
  box-shadow: ${BOX_SHADOW};
  font-size: 24px;
  background: #eee;
  font-weight: 500;
  color: #333;
  width: 240px;

  :hover,
  :focus {
    background: #fff;
  }

  ::placeholder {
    color: #aaa;
  }
`

const PlayButton = styled.a`
  display: block;
  background: ${PRIMARY};
  color: #fff;
  padding: 8px 64px;
  font-weight: 500;
  font-size: 24px;
  box-shadow: ${BOX_SHADOW};
  margin-left: 20px;
  border-radius: 4px;
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

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    localStorage.setItem('name', event.target.value)
  }

  const handleKeyDown = ({ key }: KeyboardEvent) => {
    if (key === 'Enter') {
      Router.push('/game')
    }
  }

  return (
    <FadeUp>
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
    </FadeUp>
  )
}

export default PlaySection
