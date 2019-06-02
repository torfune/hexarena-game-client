import styled from 'styled-components'
import * as React from 'react'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 30px;
  align-items: center;
  background: ${props => props.color || '#eee'};
  transition: 100ms;

  h2 {
    margin-top: 2px;
    text-transform: uppercase;
    color: ${props => (props.color ? '#fff' : '#444')};
    font-size: 18px;
    font-weight: 600;
  }
`

interface IconProps {
  size: string
}

const Icon = styled.img<IconProps>`
  height: ${props => props.size};
  filter: ${props => props.color && 'invert(1)'};
  opacity: ${props => !props.color && 0.7};
`

interface Props {
  text: string
  iconSrc: string
  iconSize: string
  color?: string
}

const Header: React.FC<Props> = ({ text, iconSrc, iconSize, color }) => (
  <Container color={color}>
    <h2>{text}</h2>
    <Icon src={iconSrc} size={iconSize} color={color} />
  </Container>
)

export default Header
