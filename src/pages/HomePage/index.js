import React from 'react'
import styled from 'styled-components'

import Logo from './components/Logo'
import PlaySection from './components/PlaySection'
import Footer from './components/Footer'

const Container = styled.div`
  width: 900px;
  margin: 0 auto;
`

class HomePage extends React.Component {
  componentDidMount = () => {
    document.addEventListener('keydown', this.handleKeyDown)
  }
  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.handleKeyDown)
  }
  handleKeyDown = ({ key }) => {
    if (key === 'Enter') {
      window.location.pathname = '/game'
    }
  }
  render() {
    return (
      <Container>
        <Logo />
        <PlaySection />
        <Footer />
      </Container>
    )
  }
}

export default HomePage
