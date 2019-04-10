import { createGlobalStyle } from 'styled-components'
import screenshotSrc from '../assets/images/screenshot.png'

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Montserrat:400,500,600,700');

  * {
    box-sizing: border-box;
    margin: 0;
    outline: none;
    user-select: none;
    touch-action: none;
  }
  
  html {
    background: url(${screenshotSrc});
    background-position-x: center;
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
