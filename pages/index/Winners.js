import React from 'react'
import styled from 'styled-components'
import Heading from './Heading'
import { version } from '../../package.json'

const Container = styled.div``

const List = styled.div`
  margin-top: 32px;
`

const Winner = styled.div`
  background: #383838;
  box-shadow: 0px 1px 24px 0px rgba(0, 0, 0, 0.05);
  padding: 16px 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`

const Name = styled.p`
  color: #fff;
  font-weight: 600;
  font-size: 20px;
  margin-left: 10px;
`

const Pattern = styled.div`
  border-radius: 100%;
  width: 16px;
  height: 16px;
  background: ${props => props.color};
`

const Winners = props => {
  if (!props.winners) return null

  const winners = props.winners.map(winner => {
    const [name, color] = winner.split(';')

    return { name, color }
  })

  return (
    <Container>
      <Heading>Winners of Alpha {version}</Heading>
      <List>
        {winners.map(({ name, color }, index) => (
          <Winner key={index}>
            <Pattern color={color} />
            <Name>{name}</Name>
          </Winner>
        ))}
      </List>
    </Container>
  )
}

export default Winners
