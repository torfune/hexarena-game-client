import React from 'react'
import styled from 'styled-components'

const Container = styled.footer`
  border-top: 1px solid #ccc;
  margin-top: 128px;
  padding: 32px 16px;
`

const Footer = () => (
  <Container>
    <p>Game by Matej Strnad &amp; Katarina Cvetkovicova</p>
  </Container>
)

export default Footer
