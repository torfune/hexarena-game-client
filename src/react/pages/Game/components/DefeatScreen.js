import React from 'react'
import styled from 'styled-components'
import { Link } from '@reach/router'
import { useSpring, animated } from 'react-spring'

const Container = styled(animated.div)`
  position: absolute;
  left: 0;
  height: 100vh;
  width: 100vw;
  background: #fff;
  text-align: center;
  padding-top: 128px;

  h2 {
    font-size: 32px;
    color: #222;
  }

  h3 {
    font-size: 20px;
    margin-top: 64px;
    color: #222;
  }

  button {
    margin-top: 128px;
    background: #333;
    color: #fff;
    border: none;
    font-size: 20px;
    font-weight: 600;
    padding: 8px 64px;
    border-radius: 4px;

    :hover {
      background: #666;
    }
  }
`

const DefeatScreen = ({ killerName, secondsSurvived }) => {
  const props = useSpring({ top: 0, from: { top: -4000 } })

  return (
    <Container style={props}>
      <h2>Capital captured by {killerName}.</h2>
      <h3>You survived for {secondsSurvived} seconds.</h3>
      <Link to="/">
        <button>Continue</button>
      </Link>
    </Container>
  )
}

export default DefeatScreen
