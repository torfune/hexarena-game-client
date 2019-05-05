import styled from 'styled-components'
import { PRIMARY } from '../constants/react'

const Container = styled.div`
  color: #fff;
  display: flex;
  flex-direction: column;
  padding: 128px;
  align-items: center;
`

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 500;
  margin-bottom: 32px;
`

const Button = styled.a`
  background: ${props => props.background};
  color: ${props => props.color};
  width: 256px;
  padding: 16px;
  border-radius: 2px;
  margin-top: 16px;
  box-shadow: 0 4px 16px #00000022;
  text-align: center;
  font-weight: 600;
  transition: 100ms;

  :hover {
    transform: scale(1.05);
  }
`

const Login = () => (
  <Container>
    <Heading>Login</Heading>

    <Button
      href="http://localhost:5000/auth/google"
      background={PRIMARY}
      color="#fff"
    >
      Sign in with Google
    </Button>

    <Button
      href="http://localhost:5000/auth/logout"
      background="#fff"
      color="#222"
    >
      Logout
    </Button>
  </Container>
)

export default Login
