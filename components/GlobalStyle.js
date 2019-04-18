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
    font-family: 'Montserrat', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  a {
    text-decoration: none;
  }
  
  @supports (font-variation-settings: normal) {
    html {
      font-family: 'Montserrat', sans-serif;
    }
  }
`

export default GlobalStyle
