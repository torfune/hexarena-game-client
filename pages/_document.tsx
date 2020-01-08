import Document, { Html, Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { STATIC } from '../src/constants/react'

class CustomDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta
            key="description"
            name="description"
            content="HexArena.io is a 100% free multiplayer, live action, strategy game."
          />
          <meta
            key="og:description"
            property="og:description"
            content="HexArena.io is a 100% free multiplayer, live action, strategy game."
          />
          <meta key="og:title" property="og:title" content="HexArena.io" />
          <meta key="og:url" property="og:url" content="https://hexarena.io" />
          <meta
            key="og:image"
            property="og:image"
            content="https://dev.hexarena.io/game/static/images/og-image.png"
          />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <link rel="stylesheet" href={`${STATIC}/global.css`} />
          <link
            rel="icon"
            type="image/x-icon"
            href={`${STATIC}/favicon/96x96.png`}
          />
          <link
            href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600'"
            rel="stylesheet"
          />
          <script src="https://browser.sentry-cdn.com/5.6.3/bundle.min.js"></script>
          {/* <script>
      const getEnvironment = () => {
        switch (window.location.hostname) {
          case 'localhost':
            return 'local'
          case 'dev.hexarena.io':
            return 'development'
          case 'hexarena.io':
            return 'production'
          default:
            return 'unknown-environment'
        }
      }
      Sentry.init({
        dsn: 'https://28bb77120c0b45a991f6c251a58ffa63@sentry.io/1438180',
        environment: getEnvironment(),
      })
    </script> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default CustomDocument
