import App, { Container } from 'next/app'
import Router from 'next/router'
import { AuthProvider } from '../auth'
import getEnvironment from '../utils/getEnvironment'
import trackPageView from '../utils/trackPageView'

declare const Sentry: any

class MyApp extends App {
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
  }

  render() {
    const { Component, pageProps } = this.props

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
