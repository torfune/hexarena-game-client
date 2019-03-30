import React from 'react'
import styled from 'styled-components'
import { PRIMARY } from '../constants'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 30px;
  align-items: center;
  background: ${props => (props.red ? PRIMARY : '#eee')};

  h2 {
    margin-top: 2px;
    text-transform: uppercase;
    color: ${props => (props.red ? '#fff' : '#444')};
    font-size: 18px;
    font-weight: 600;
  }
`

const Icon = styled.img`
  height: ${props => props.size};
  filter: ${props => props.red && 'invert(1)'};
  opacity: ${props => !props.red && 0.7};
`

const Header = ({ text, iconSrc, iconSize, red }) => (
  <Container red={red}>
    <h2>{text}</h2>
    <Icon src={iconSrc} size={iconSize} red={red} />
  </Container>
)

export default Header
