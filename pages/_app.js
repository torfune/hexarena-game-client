import React from 'react'
import App, { Container } from 'next/app'
import Router from 'next/router'
import trackPageView from 'utils/trackPageView'
import getEnvironment from 'utils/getEnvironment'
import { AuthProvider } from '../auth'

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
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
