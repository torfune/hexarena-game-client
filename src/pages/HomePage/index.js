import React from 'react'
import styled from 'styled-components'
import { navigate } from '@reach/router'

import Logo from './components/Logo'
import ReleaseNotes from './components/ReleaseNotes'
import PlaySection from './components/PlaySection'
import Footer from './components/Footer'

const Container = styled.div`
  width: 1200px;
  margin: 0 auto;
  background: #333;
  padding-top: 64px;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 72px 0px rgba(0, 0, 0, 0.2);
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
      navigate('game')
    }
  }
  render() {
    return (
      <Container>
        <Logo />
        <PlaySection />
        <ReleaseNotes />
        <Footer />
      </Container>
    )
  }
}

export default HomePage
