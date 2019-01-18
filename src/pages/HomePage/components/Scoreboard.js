import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  height: 300px;
  width: 300px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 1px 1px 16px rgba(0, 0, 0, 0.2);
`

const ScoreBoard = ({ children }) => <Container>{children}</Container>

export default ScoreBoard
