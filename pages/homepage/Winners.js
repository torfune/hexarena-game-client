import React from 'react'
import styled from 'styled-components'
import Heading from './Heading'
import store from 'store'
import { version } from '../../package.json'
import { observer } from 'mobx-react-lite'

const Container = styled.div``

const List = styled.div`
  margin-top: 32px;
`

const Winner = styled.div`
  background: #383838;
  box-shadow: 0px 1px 24px 0px rgba(0, 0, 0, 0.05);
  padding: 8px 32px;
  border-radius: 8px;
  margin-bottom: 8px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 0;
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

const Winners = () => {
  const winners = store.winners.map(winner => {
    const players = winner.split('|').map(player => {
      const [name, pattern] = player.split(';')
      return { name, pattern }
    })

    return { players }
  })

  return (
    <Container>
      <Heading>Alpha {version.replace('-dev', '')} winners</Heading>
      <List>
        {winners.map((winner, index) => (
          <Winner key={index}>
            {winner.players.map(player => (
              <Row key={player.name}>
                <Pattern color={player.pattern} />
                <Name>{player.name}</Name>
              </Row>
            ))}
          </Winner>
        ))}
      </List>
    </Container>
  )
}

export default observer(Winners)
