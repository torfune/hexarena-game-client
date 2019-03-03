import React from 'react'
import styled from 'styled-components'

import Heading from './Heading'
import { BOX_SHADOW } from '../../../constants'

const Container = styled.div`
  padding: 0 16px;
`

const List = styled.div`
  max-height: 100px;
  overflow-y: scroll;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  padding-right: 8px;
`

const Winner = styled.p`
  color: #fff;
  font-weight: 500;
  font-size: 14px;
  background: #444;
  box-shadow: ${BOX_SHADOW};
  padding: 8px 4px;
  text-align: center;
  border-radius: 4px;
`

const Winners = ({ winners }) => (
  <Container>
    <Heading>Winners</Heading>
    <List>
      {winners.map((name, index) => (
        <Winner key={index}>{name}</Winner>
      ))}
    </List>
  </Container>
)

export default Winners
