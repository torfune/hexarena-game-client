import React from 'react'
import styled from 'styled-components'

import Logo from './components/Logo'
import PlaySection from './components/PlaySection'
import Footer from './components/Footer'

const Container = styled.div`
  width: 900px;
  margin: 0 auto;
`

const HomePage = () => (
  <Container>
    <Logo />
    <PlaySection />
    <Footer />
  </Container>
)

export default HomePage
