import React from 'react'
import styled from 'styled-components'

import Heading from './Heading'

const Container = styled.div`
  margin-top: 96px;
  padding: 0 16px;
  background: #fff;
`

const Table = styled.div``

const ScoreBoard = () => (
  <Container>
    <Heading>Best players</Heading>
    <Table />
  </Container>
)

export default ScoreBoard
