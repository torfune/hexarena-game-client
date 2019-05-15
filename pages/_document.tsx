import Document, {
  Head,
  Main,
  NextScript,
  NextDocumentContext,
} from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import GlobalStyle from '../components/GlobalStyle'

export default class extends Document<{
  styleTags: any
  isProduction: boolean
}> {
  static getInitialProps({ renderPage }: NextDocumentContext) {
    const isProduction = process.env.NODE_ENV === 'production'
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props =>
      sheet.collectStyles(<App {...props} />)
    )

    const styleTags = sheet.getStyleElement()

    return { ...page, styleTags, isProduction }
  }

  setGoogleTags() {
    return {
      __html: `
        window.dataLayer = window.dataLayer || []
        function gtag() {
          dataLayer.push(arguments)
        }
        gtag('js', new Date())
        gtag('config', 'UA-68180597-3')
      `,
    }
  }

  render() {
    return (
      <html>
        <GlobalStyle />
        <Head>
          <script
            src="https://browser.sentry-cdn.com/5.0.7/bundle.min.js"
            crossOrigin="anonymous"
          />
          <script
            src="https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.8.7/pixi.min.js"
            crossOrigin="anonymous"
          />
          <link
            rel="icon"
            type="image/x-icon"
            href="/static/favicon/96x96.png"
          />
          <link
            href="https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700'"
            rel="stylesheet"
          />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />

          {/* {this.props.isProduction && (
            <>
              <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=UA-68180597-2"
              />
              <script dangerouslySetInnerHTML={this.setGoogleTags()} />
            </>
          )} */}
        </body>
      </html>
    )
  }
}
