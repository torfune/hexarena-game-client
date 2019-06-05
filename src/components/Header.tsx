import styled from 'styled-components'
import * as React from 'react'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  align-items: center;
  background: ${props => props.color || '#fff'};
  transition: 100ms;

  h2 {
    margin-top: 2px;
    text-transform: uppercase;
    color: ${props => (props.color ? '#fff' : '#333')};
    font-size: 17px;
    font-weight: 600;
  }
`

interface Props {
  text: string
  iconSrc: string
  iconSize: string
  color?: string
}

const Header: React.FC<Props> = ({ text, color }) => (
  <Container color={color}>
    <h2>{text}</h2>
  </Container>
)

export default Header
