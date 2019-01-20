import React from 'react'
import styled from 'styled-components'

import { GOOGLE_PRIMARY } from '../../../constants'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  border-bottom: 1px solid #ddd;
  padding: 28px 16px;
  color: ${GOOGLE_PRIMARY};
  font-size: 24px;

  h1 > span {
    color: #333;
  }

  h1 {
    margin: 0;
  }

  h2 {
    margin: 0;
    font-size: 20px;
    color: #444;
  }
`

const Logo = () => (
  <Container>
    <h1>
      Hexagor<span>.</span>io
    </h1>
    <h2>Strategy MMO browser game</h2>
  </Container>
)

export default Logo
