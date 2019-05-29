import App, { Container } from 'next/app'
import Router from 'next/router'
import { AuthProvider } from '../auth'
import getEnvironment from '../utils/getEnvironment'
import trackPageView from '../utils/trackPageView'
import { MIN_SCREEN_HEIGHT, MIN_SCREEN_WIDTH } from '../constants/react'
import NotEnoughScreenSize from '../components/NotEnoughScreenSize'

declare const Sentry: any

class MyApp extends App {
  state = {
    notEnoughScreenSize: false,
    width: 0,
    height: 0,
  }

  componentDidMount() {
    Router.onRouteChangeComplete = url => {
      trackPageView(url)
    }

    if (window.location.hostname !== 'localhost') {
      Sentry.init({
        dsn: 'https://28bb77120c0b45a991f6c251a58ffa63@sentry.io/1438180',
        environment: getEnvironment(),
      })
    }

    const notEnoughScreenSize =
      window.innerHeight < MIN_SCREEN_HEIGHT ||
      window.innerWidth < MIN_SCREEN_WIDTH

    this.setState({
      width: window.innerWidth,
      height: window.innerHeight,
      notEnoughScreenSize,
    })
  }

  render() {
    const { Component, pageProps } = this.props

    if (this.state.notEnoughScreenSize) {
      return (
        <NotEnoughScreenSize
          width={this.state.width}
          height={this.state.height}
        />
      )
    }

    return (
      <Container>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </Container>
    )
  }
}

export default MyApp
