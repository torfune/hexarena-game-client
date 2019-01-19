import React from 'react'
import styled from 'styled-components'

import BackButton from '../../shared/BackButton'

const Container = styled.div`
  padding: 56px;
  text-align: center;
`

const Name = styled.h2`
  font-size: 18px;
`

const Email = styled.p`
  font-size: 18px;
`

const ContactPage = () => (
  <Container>
    <BackButton />
    <Name>Matěj Strnad:</Name>
    <Email>matej.strnad.97@gmail.com</Email>
    <Name>Katarina Cvetkovicova:</Name>
    <Email>katarina.cvetkovicova@gmail.com</Email>
  </Container>
)

export default ContactPage
