import { version } from '../../package.json'
import axios from 'axios'
import Router from 'next/router'
import Footer from './Footer'
import Logo from './Logo'
import PlaySection from './PlaySection'
import React from 'react'
import ReleaseNotes from './ReleaseNotes'
import styled from 'styled-components'
import Winners from './Winners'
import getGameserverHost from 'utils/getGameserverHost.js'
import getEnvironment from 'utils/getEnvironment.js'

const Container = styled.div`
  width: 1300px;
  margin: 0 auto;
  background: #333;
  padding-top: 64px;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 72px 0px rgba(0, 0, 0, 0.5);
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  padding: 96px 128px;
  grid-gap: 64px;
`

const Error = styled.div`
  color: #fff;
  text-align: center;
  background: #444;
  margin-top: 128px;
  padding: 32px;
`

const BlackOverlay = styled.div`
  background: #000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  opacity: 0.6;
`

class HomePage extends React.Component {
  interval = null
  state = {
    disabledUntil: null,
    countdownTime: null,
    winners: null,
    errorMessage: null,
  }
  componentDidMount = async () => {
    Sentry.init({
      dsn: 'https://28bb77120c0b45a991f6c251a58ffa63@sentry.io/1438180',
      environment: getEnvironment(),
    })

    const GAMESERVER_HOST = getGameserverHost(window.location.hostname)

    const statusRes = await axios.get(`http://${GAMESERVER_HOST}/status`)
    const winnersRes = await axios.get(`http://${GAMESERVER_HOST}/winners`)

    const winners = winnersRes.data
      .split('\n')
      .filter(l => l !== '')
      .reverse()

    this.setState({ winners })

    const { timeRemaining, version: gsVersion } = statusRes.data

    if (timeRemaining) {
      const now = Date.now()
      const disabledUntil = now + Number(timeRemaining)

      if (disabledUntil > now) {
        this.setState({ disabledUntil })
        this.interval = setInterval(this.updateCountdown, 100)
      } else {
        this.setState({ disabledUntil: false })
      }
    } else {
      this.setState({ disabledUntil: false })
    }

    if (gsVersion !== version) {
      console.log(`Versions not matched! GS: ${gsVersion}, FE: ${version}`)
      this.setState({
        errorMessage: `GameServer version is not same as client version.`,
      })
    }

    document.addEventListener('keydown', this.handleKeyDown)
  }
  componentWillUnmount = () => {
    document.removeEventListener('keydown', this.handleKeyDown)
  }
  handleKeyDown = ({ key }) => {
    if (this.state.disabledUntil !== false) return

    if (key === 'Enter') {
      Router.push('/game')
    }
  }
  updateCountdown = () => {
    const { disabledUntil } = this.state

    const now = Date.now()

    if (now >= disabledUntil) {
      this.setState({ disabledUntil: false })
      clearInterval(this.interval)
      this.interval = null
    } else {
      this.setState({ countdownTime: disabledUntil - now })
    }
  }
  render() {
    const { disabledUntil, countdownTime, winners, errorMessage } = this.state

    if (errorMessage) {
      return <Error>{errorMessage}</Error>
    }

    return (
      <Container>
        <Logo />
        <PlaySection
          disabledUntil={disabledUntil}
          countdownTime={countdownTime}
        />
        <Grid>
          <ReleaseNotes />
          <Winners winners={winners} />
        </Grid>
        <Footer />
        <BlackOverlay />
      </Container>
    )
  }
}

export default HomePage
