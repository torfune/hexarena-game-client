import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import GlobalStyle from '../components/GlobalStyle'

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet()

    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    )

    const styleTags = sheet.getStyleElement()

    return { ...page, styleTags }
  }

  render() {
    return (
      <html>
        <GlobalStyle />
        <Head>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.5.1/pixi.min.js" />
          <link
            rel="icon"
            type="image/x-icon"
            href="/static/favicon/96x96.png"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700'"
            rel="stylesheet"
          />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
