import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    border: 0;
    outline: none;
    user-select: none;
    touch-action: none;
    font-family: 'Montserrat', sans-serif;
  }

  html {
    min-height: 100vh;
    width: 100vw;
    overflow-x: hidden;
    background: #2a2a2a;
  }

  a {
    text-decoration: none;
  }

  ul {
    padding-inline-start: 0;
  }

  @supports (font-variation-settings: normal) {
    html {
      font-family: 'Montserrat', sans-serif;
    }
  }
`

export default GlobalStyle
